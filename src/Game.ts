import 'babylonjs-loaders';
import { lose, mainMenu, soloMenu, start, win } from './states';
import { Engine, Scene } from 'babylonjs';
import { disposeLevel1, initLevel1, level1 } from './states/level1';
import { Character, Environment } from './models';
import { GameState } from './defs';

export class Game {
    engine: Engine;

    scene: Scene | null = null;
    environment: Environment | null = null;
    characterController: Character | null = null;

    gameState: GameState = {
        isPaused: false,
        isExited: false,
        score1: 0,
        score2: 0,

        destroyMesh: null,
        state: 'on-going',
    }

    // states
    protected gotoStart = start;
    protected gotoMainMenu = mainMenu;
    protected gotoSoloMenu = soloMenu;
    protected goToWin = win;
    protected goToLose = lose;

    protected gotoLevel1 = level1;
    protected setupLevel1 = initLevel1;
    protected removeLevel1 = disposeLevel1;


    constructor(readonly canvas: HTMLCanvasElement) {
        // create BabylonJS engine with anti-aliasing activated
        this.engine = new Engine(canvas, true)

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // create the scene
        this.scene = new Scene(this.engine);
    }

    async run() {
        await this.gotoStart();

        // running render loop
        this.engine.runRenderLoop(() => {
            this.scene!.render();
        });
    }

    resetGame() {
        this.gameState.isPaused = false;
        this.gameState.isExited = false;
        this.gameState.score1 = 0;
        this.gameState.score2 = 0;
        this.gameState.destroyMesh = null;
        this.gameState.state = 'on-going';
    }
}