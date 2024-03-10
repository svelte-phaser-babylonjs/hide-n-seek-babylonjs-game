import 'babylonjs-loaders';
import { gameFinished, mainMenu, multiMenu, soloMenu, start } from './states';
import { Engine, Scene } from 'babylonjs';
import { disposeLevel1, initLevel1, level1 } from './states/level1';
import { Character, Environment, SoundManager } from './models';
import { GameState } from './defs';

export class Game {
    engine: Engine;

    scene: Scene | null = null;
    environment: Environment | null = null;
    characterController: Character[] = [];

    soundManager: SoundManager;

    gameState: GameState = {
        isPaused: false,
        isExited: false,
        score1: 0,
        score2: 0,
        winScore: 0,

        destroyMesh: null,
        isGameOver: false,
        isTwoPlayer: false,
    }

    // states
    protected gotoStart = start;
    protected gotoMainMenu = mainMenu;
    protected gotoSoloMenu = soloMenu;
    protected gotoMultiMenu = multiMenu;
    protected goToGameFinished = gameFinished;

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

        this.soundManager = new SoundManager();
    }

    async run() {
        await this.soundManager.loadSounds();
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
        this.gameState.winScore = 0;
        this.gameState.destroyMesh = null;
        this.gameState.isGameOver = false;
        this.gameState.isTwoPlayer = false;
    }
}