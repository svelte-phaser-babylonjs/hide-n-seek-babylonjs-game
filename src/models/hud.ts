import { Camera, FreeCamera, KeyboardEventTypes, Mesh, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Button, Control, Ellipse, Rectangle, TextBlock } from "babylonjs-gui";
import { image, rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
import { CATCH_FEEDBACK_SPEED, FONT_SIZE_PERCENTAGE, GameState } from "../defs";

export default class {
    private scene: Scene;

    // UI components
    private texture!: AdvancedDynamicTexture;
    private timer!: TextBlock;
    private score1!: TextBlock;
    private score2!: TextBlock;
    private modal!: Rectangle;
    private resumeBtn!: Button;
    private exitBtn!: Button;
    private state: GameState;

    public destroyMesh: ((mesh: Mesh, playerNumber: number) => void) | null;

    // Timer components
    private counter = 60;

    constructor(scene: Scene, state: GameState) {
        this.scene = scene;
        this.state = state;

        this.setupUI(state);

        this.destroyMesh = async (mesh: Mesh, playerNumber: number) => {
            await scene.whenReadyAsync();

            const canvas = document.getElementById("renderCanvas");
            const ratio = playerNumber === 1 ? -0.025 : 0.25;

            const feedback = new Ellipse();
            feedback.widthInPixels = 40;
            feedback.heightInPixels = 40;
            feedback.background = "white";
            feedback.zIndex = 10;

            if (state.isTwoPlayer) {
                feedback.leftInPixels = canvas!.offsetWidth * ratio;
            }

            this.texture.addControl(feedback);

            feedback.linkWithMesh(mesh);

            const dt = scene.getEngine().getDeltaTime() / 1000;

            setTimeout(() => {
                feedback.linkWithMesh(null);

                const distanceX = !state.isTwoPlayer ? feedback.leftInPixels / CATCH_FEEDBACK_SPEED : ((canvas!.offsetWidth / 2) + (canvas!.offsetWidth * ratio)) / CATCH_FEEDBACK_SPEED;
                const distanceY = !state.isTwoPlayer ? feedback.topInPixels / CATCH_FEEDBACK_SPEED : (canvas!.offsetHeight / 2) / CATCH_FEEDBACK_SPEED;

                const interval = setInterval(() => {
                    if (feedback.leftInPixels > -(canvas!.offsetWidth / 2)) {
                        feedback.leftInPixels -= distanceX;
                        feedback.topInPixels -= distanceY;
                    } else {
                        clearInterval(interval);
                        feedback.dispose();
                        mesh.dispose();
                    }
                }, dt);
            }, 250);
        }

        this.scene.registerBeforeRender(() => {
            if (state.isPaused) return;

            if (this.score1) {
                this.score1.text = `${state.score1} / 10`;
            }

            if (this.score2) {
                this.score2.text = `${state.score2} / 10`;
            }

            this.updateHud();

            if (state.score1 + state.score2 === state.winScore) {
                setTimeout(() => {
                    state.isGameOver = true;
                }, 500);
            }
        })
    }

    private async setupUI(state: GameState) {
        this.texture = AdvancedDynamicTexture.CreateFullscreenUI("hud-texture", true, this.scene);

        if (state.isTwoPlayer) {
            const guiCamera = new FreeCamera("hud-cam", new Vector3(0, 0, 0), this.scene);
            guiCamera.mode = Camera.ORTHOGRAPHIC_CAMERA;
            guiCamera.layerMask = 0x10000000;
            this.scene.activeCameras?.push(guiCamera);
            this.texture.layer!.layerMask = 0x10000000;
        }

        this.timer = await simpleTextBlock("timer", "1:00", "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
        this.texture.addControl(this.timer);

        // rabit image for rabit counter
        const rabbitImage = await image("rabit-img", "assets/textures/UI/level1.svg", 0.1, 0.1, 0, 0, Control.HORIZONTAL_ALIGNMENT_LEFT, Control.VERTICAL_ALIGNMENT_TOP);
        this.texture.addControl(rabbitImage);

        this.score1 = await simpleTextBlock('rabbit-counter', `${state.score1} / 10`, "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
        this.score1.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
        this.score1.leftInPixels = 0.08 * window.innerWidth;
        this.score1.width = 0.25;
        this.texture.addControl(this.score1);

        if (state.isTwoPlayer) {
            // rabit image for rabit counter
            const rabbitImage = await image("rabit-img", "assets/textures/UI/level1.svg", 0.1, 0.1, 0, 0.90 * window.innerWidth, Control.HORIZONTAL_ALIGNMENT_LEFT, Control.VERTICAL_ALIGNMENT_TOP);
            this.texture.addControl(rabbitImage);

            this.score2 = await simpleTextBlock('rabbit-counter', `${state.score2} / 10`, "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
            this.score2.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
            this.score2.leftInPixels = 0.7 * window.innerWidth;
            this.score2.width = 0.25;
            this.texture.addControl(this.score2);
        }

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
            this.score1.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
            this.resumeBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
            this.exitBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
        });
    }

    private async formatTime() {
        if (this.counter < 0) {
            this.state.isGameOver = true;
            return "0";
        }

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