import { Scene } from "babylonjs";
import { AdvancedDynamicTexture, Control, TextBlock } from "babylonjs-gui";
import { simpleTextBlock } from "../helpers/gui_generator";
import { FONT_SIZE_PERCENTAGE } from "../defs";

export default class {
    private scene: Scene;

    // UI components
    private texture!: AdvancedDynamicTexture;
    private timer!: TextBlock;

    // Timer components
    private counter = 60;

    constructor(scene: Scene) {
        this.scene = scene;

        this.setupUI();

        this.scene.registerBeforeRender(() => {
            this.updateHud();
        })
    }

    private async setupUI() {
        this.texture = AdvancedDynamicTexture.CreateFullscreenUI("hud-texture", true, this.scene);
        this.timer = await simpleTextBlock("timer", "1:00", "yellow", FONT_SIZE_PERCENTAGE, 0.1, 0, Control.VERTICAL_ALIGNMENT_TOP);
        this.texture.addControl(this.timer);

        window.addEventListener("resize", () => {
            this.timer.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
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