import { DirectionalLight, FreeCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { Character, Environment, Hud } from "../models";
import { GameState } from "../defs";

let levelScene: Scene | null = null;

const winScore = 10;

export async function initLevel1(this: Game) {
    this.gameState.winScore = winScore;

    levelScene = new Scene(this.engine);
    this.environment = new Environment(levelScene, this.gameState, winScore);

    levelScene.registerBeforeRender(() => {
        if (this.gameState.isExited) this.gotoMainMenu();
        if (this.gameState.score1 === winScore || this.gameState.score2 === winScore || this.gameState.isGameOver) {
            this.gameState.isGameOver = false;
            this.goToGameFinished();
        }
    });
}

export async function disposeLevel1(this: Game) {
    levelScene!.dispose();
}

export async function level1(this: Game) {
    this.soundManager.stopMainMenuMusic();
    this.soundManager.playGameMusic();
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    if (!levelScene || !this.environment) {
        await initLevel1.call(this);
    }

    createLevel.call(this);
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

    this.characterController[0] = new Character(levelScene!, this.gameState, 1, 0, 0);

    if (this.gameState.isTwoPlayer) {
        this.characterController[1] = new Character(levelScene!, this.gameState, 2, 2, 2);
    }
}

async function makeHud(state: GameState) {
    state.destroyMesh = await new Hud(levelScene!, state).destroyMesh;
}