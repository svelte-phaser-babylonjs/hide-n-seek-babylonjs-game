import { DirectionalLight, FreeCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { Character, Environment, Hud } from "../models";
import { GameState } from "../defs";

let levelScene: Scene | null = null;

let winScore = 10;

export async function initLevel1(this: Game) {
    levelScene = new Scene(this.engine);
    this.environment = new Environment(levelScene, this.gameState, winScore);

    levelScene.registerBeforeRender(() => {
        if (this.gameState.isExited) this.gotoMainMenu();
        if (this.gameState.score1 === winScore) {
            this.gameState.state = 'on-going';
            this.goToWin();
        } else if (this.gameState.state === 'lose') {
            this.gameState.state = 'on-going';
            this.goToLose();
        }
    });
}

export async function disposeLevel1(this: Game) {
    levelScene!.dispose();
}

export async function level1(this: Game) {
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    if (!levelScene || !this.environment) {
        await initLevel1.call(this);
    }

    await createLevel.call(this);
    await makeHud(this.gameState);

    await this.scene!.whenReadyAsync();

    levelScene!.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = levelScene;
}

async function createLevel(this: Game) {
    const light = new DirectionalLight("light", new Vector3(0, 1, 1), levelScene!);
    light.intensity = 0.4;

    this.characterController = new Character(levelScene!, this.gameState, "player1", "character1", 0, 0);
}

async function makeHud(state: GameState) {
    const hud = await new Hud(levelScene!, state);

    state.destroyMesh = hud.destroyMesh;
}