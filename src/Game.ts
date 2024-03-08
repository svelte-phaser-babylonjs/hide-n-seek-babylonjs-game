import 'babylonjs-loaders';
import { mainMenu, soloMenu, start } from './states';
import { Engine, Scene } from 'babylonjs';
import { disposeLevel1, initLevel1, level1 } from './states/level1';
import { Environment } from './models';

export class Game {
    engine: Engine;

    scene: Scene | null = null;

    environment: Environment | null = null;

    // states
    protected gotoStart = start;
    protected gotoMainMenu = mainMenu;
    protected gotoSoloMenu = soloMenu;
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
}