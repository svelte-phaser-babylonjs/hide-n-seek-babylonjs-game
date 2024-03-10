import { DirectionalLight, FreeCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { Character, Environment, Hud } from "../models";
import { GameState } from "../defs";

let levelScene: Scene | null = null;

const winScore = 10;

export async function initLevel1(this: Game) {
    this.state.winScore = winScore;

    levelScene = new Scene(this.engine);
    this.environment = new Environment(levelScene, this.state, winScore);

    levelScene.registerBeforeRender(() => {
        if (this.state.isExited) this.gotoMainMenu();
        if (this.state.score1 === winScore || this.state.score2 === winScore || this.state.isGameOver) {
            this.state.isGameOver = false;
            this.goToGameFinished();
        }
    });
}

export async function disposeLevel1(this: Game) {
    levelScene!.dispose();
}

export async function level1(this: Game) {
    this.state.soundManager!.playGameMusic();

    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    if (!levelScene || !this.environment) {
        await initLevel1.call(this);
    }

    await createLevel.call(this);
    await makeHud(this.state);

    await this.scene!.whenReadyAsync();

    levelScene!.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = levelScene;
}

async function createLevel(this: Game) {
    const light = new DirectionalLight("light", new Vector3(0, 1, 1), levelScene!);
    light.intensity = 0.4;

    this.characterController1 = new Character(levelScene!, this.state, 1, 0, 0);

    if (this.state.isTwoPlayer) {
        this.characterController2 = new Character(levelScene!, this.state, 2, 2, 2);
    }
}

async function makeHud(state: GameState) {
    const hud = await new Hud(levelScene!, state);
    state.destroyMesh = hud.destroyMesh;
    state.setupJoystick = hud.setupJoystick;
}