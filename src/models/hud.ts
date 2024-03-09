import { KeyboardEventTypes, Scene } from "babylonjs";
import { AdvancedDynamicTexture, Button, Control, Rectangle, TextBlock } from "babylonjs-gui";
import { image, rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
import { FONT_SIZE_PERCENTAGE, GameState } from "../defs";

export default class {
    private scene: Scene;

    // UI components
    private texture!: AdvancedDynamicTexture;
    private timer!: TextBlock;
    private score!: TextBlock;
    private modal!: Rectangle;
    private resumeBtn!: Button;
    private exitBtn!: Button;

    // Timer components
    private counter = 60;

    constructor(scene: Scene, state: GameState) {
        this.scene = scene;

        this.setupUI(state);

        this.scene.registerBeforeRender(() => {
            if (state.isPaused) return;

            this.updateHud();
        })
    }

    private async setupUI(state: GameState) {
        this.texture = AdvancedDynamicTexture.CreateFullscreenUI("hud-texture", true, this.scene);

        this.timer = await simpleTextBlock("timer", "1:00", "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
        this.texture.addControl(this.timer);

        // rabit image for rabit counter
        const rabbitImage = await image("rabit-img", "assets/textures/UI/level1.svg", 0.1, 0.1, 0, 0, Control.HORIZONTAL_ALIGNMENT_LEFT, Control.VERTICAL_ALIGNMENT_TOP);
        this.texture.addControl(rabbitImage);

        this.score = await simpleTextBlock('rabbit-counter', "0 / 10", "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
        this.score.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.score.leftInPixels = 0.04 * window.innerWidth;
        this.score.width = 0.25;
        this.texture.addControl(this.score);

        this.modal = await rectangle("pause-modal", 1, 1, 0, "black");
        this.modal.zIndex = 3;
        this.modal.alpha = 0.3;
        this.modal.isVisible = state.isPaused;
        this.texture.addControl(this.modal);

        this.resumeBtn = await simpleButton("resume-pause-btn", "Resume", FONT_SIZE_PERCENTAGE, 0.1, -(window.innerHeight / 10), Control.VERTICAL_ALIGNMENT_CENTER);

        this.resumeBtn.isVisible = state.isPaused;
        this.resumeBtn.zIndex = 5;
        this.resumeBtn.onPointerClickObservable.add(() => {
            this.changePause(state);
        });
        this.texture.addControl(this.resumeBtn);

        this.exitBtn = await simpleButton("exit-btn", "Exit", FONT_SIZE_PERCENTAGE, 0.1, (window.innerHeight / 10), Control.VERTICAL_ALIGNMENT_CENTER);

        this.exitBtn.isVisible = state.isPaused;
        this.exitBtn.zIndex = 5;
        this.exitBtn.onPointerClickObservable.add(() => {
            state.isExited = true;
        });
        this.texture.addControl(this.exitBtn);

        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                switch (kbInfo.event.key) {
                    case "Escape":
                        this.changePause(state);
                        break;
                }
            }
        })

        window.addEventListener("resize", () => {
            this.timer.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
            this.score.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
            this.resumeBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
            this.exitBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
        });
    }

    private async formatTime() {
        if (this.counter < 0) return "0";

        return String(Math.round(this.counter));
    }

    private async updateHud() {
        if (!this.scene) return;

        const dt = this.scene.getEngine().getDeltaTime() / 1000;

        this.counter -= dt;

        this.timer.text = await this.formatTime();
    }

    private changePause(state: GameState) {
        state.isPaused = !state.isPaused;
        this.resumeBtn.isVisible = state.isPaused;
        this.exitBtn.isVisible = state.isPaused;
        this.modal.isVisible = state.isPaused;
    }
}