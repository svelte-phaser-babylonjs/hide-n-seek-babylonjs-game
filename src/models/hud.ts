import { KeyboardEventTypes, Scene } from "babylonjs";
import { AdvancedDynamicTexture, Button, Control, TextBlock } from "babylonjs-gui";
import { image, rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
import { FONT_SIZE_PERCENTAGE, GameState } from "../defs";

export default class {
    private scene: Scene;

    // UI components
    private texture!: AdvancedDynamicTexture;
    private timer!: TextBlock;
    private rabbitCounter!: TextBlock;
    private resumeBtn!: Button;

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

        this.rabbitCounter = await simpleTextBlock('rabbit-counter', "0 / 10", "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
        this.rabbitCounter.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.rabbitCounter.leftInPixels = 0.04 * window.innerWidth;
        this.rabbitCounter.width = 0.25;
        this.texture.addControl(this.rabbitCounter);

        const modal = await rectangle("pause-modal", 1, 1, 0, "black");
        modal.zIndex = 3;
        modal.alpha = 0.3;
        modal.isVisible = false;
        this.texture.addControl(modal);

        this.resumeBtn = await simpleButton("resume-pause-btn", "Resume", FONT_SIZE_PERCENTAGE, 0.1, -(window.innerHeight / 20), Control.VERTICAL_ALIGNMENT_CENTER);

        this.resumeBtn.isVisible = state.isPaused;
        this.resumeBtn.zIndex = 5;
        this.resumeBtn.onPointerClickObservable.add(() => {
            state.isPaused = !state.isPaused;
            this.resumeBtn.isVisible = state.isPaused;
        });
        this.texture.addControl(this.resumeBtn);

        this.scene.onKeyboardObservable.add((kbInfo) => {
            if (kbInfo.type === KeyboardEventTypes.KEYUP) {
                switch (kbInfo.event.key) {
                    case "Escape":
                        state.isPaused = !state.isPaused;
                        this.resumeBtn.isVisible = state.isPaused;
                        break;
                }
            }
        })

        window.addEventListener("resize", () => {
            this.timer.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
            this.rabbitCounter.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
        })
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
}