import 'babylonjs-loaders';
import { gameFinished, mainMenu, multiMenu, optionsMenu, soloMenu, start } from './states';
import { Engine, Scene } from 'babylonjs';
import { disposeLevel1, initLevel1, level1 } from './states/level1';
import { Character, Environment, SoundManager } from './models';
import { GameState } from './defs';

export class Game {
    engine: Engine;

    scene: Scene | null = null;
    environment: Environment | null = null;
    characterController1: Character | null = null;
    characterController2: Character | null = null;

    isMobile: boolean;

    state: GameState = {
        isPaused: false,
        isExited: false,
        score1: 0,
        score2: 0,
        winScore: 0,

        destroyMesh: null,
        isGameOver: false,
        isTwoPlayer: false,
        soundManager: null,

        input1: {
            up: "w",
            down: "s",
            left: "a",
            right: "d",
        },

        input2: {
            up: "ArrowUp",
            down: "ArrowDown",
            left: "ArrowLeft",
            right: "ArrowRight",
        },
    }

    // states
    protected gotoStart = start;
    protected gotoMainMenu = mainMenu;
    protected gotoSoloMenu = soloMenu;
    protected gotoMultiMenu = multiMenu;
    protected gotoOptionsMenu = optionsMenu;
    protected goToGameFinished = gameFinished;

    protected gotoLevel1 = level1;
    protected setupLevel1 = initLevel1;
    protected removeLevel1 = disposeLevel1;

    constructor(readonly canvas: HTMLCanvasElement, isMobile: boolean) {
        this.isMobile = isMobile;

        // create BabylonJS engine with anti-aliasing activated
        this.engine = new Engine(canvas, true)

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // create the scene
        this.scene = new Scene(this.engine);

        this.state.soundManager = new SoundManager();
    }

    async run() {
        await this.gotoStart();

        // running render loop
        this.engine.runRenderLoop(() => {
            this.scene!.render();
        });
    }

    resetGame() {
        this.state.isPaused = false;
        this.state.isExited = false;
        this.state.score1 = 0;
        this.state.score2 = 0;
        this.state.winScore = 0;
        this.state.destroyMesh = null;
        this.state.isGameOver = false;
        this.state.isTwoPlayer = false;

        this.characterController1 = null;
        this.characterController2 = null;
    }
}