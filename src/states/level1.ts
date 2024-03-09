import { DirectionalLight, FreeCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { Character, Environment, Hud } from "../models";

let levelScene: Scene | null = null;

export async function initLevel1(this: Game) {
    levelScene = new Scene(this.engine);
    this.environment = new Environment(levelScene);
}

export async function disposeLevel1(this: Game) {
    levelScene!.dispose();
}

export async function level1(this: Game) {
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    if (!levelScene) {
        await initLevel1.call(this);
    }

    await createLevel.call(this);

    await makeHud();

    await this.scene!.whenReadyAsync();

    levelScene!.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = levelScene;
}

async function createLevel(this: Game) {
    const light = new DirectionalLight("light", new Vector3(0, 1, 1), levelScene!);
    light.intensity = 0.4;

    this.characterController = new Character(levelScene!, "player1", "character1", 0, 0);
}

async function makeHud() {
    await new Hud(levelScene!);
}