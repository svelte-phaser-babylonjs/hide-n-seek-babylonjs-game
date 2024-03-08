import { Scene } from "babylonjs";
import { Game } from "../Game";

let levelScene: Scene | null = null;

export async function initLevel1(this: Game) {
    levelScene = new Scene(this.engine);
}

export async function disposeLevel1(this: Game) {
    levelScene!.dispose();
}

export async function level1(this: Game) {
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    // await createGUI.call(this, sceneToLoad);

    await this.scene!.whenReadyAsync();

    levelScene!.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = levelScene;
}