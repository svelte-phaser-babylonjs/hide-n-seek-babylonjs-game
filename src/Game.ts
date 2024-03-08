import { State, Status } from './defs';
import { mainMenu, soloMenu, start } from './states';
import { Engine, Scene } from 'babylonjs';
import 'babylonjs-loaders';

export class Game {
    engine: Engine;

    status: Status = {
        scene: null,
        state: State.START,
    }

    // states
    protected gotoStart = start;
    protected gotoMainMenu = mainMenu;
    protected gotoSoloMenu = soloMenu;

    constructor(readonly canvas: HTMLCanvasElement) {
        // create BabylonJS engine with anti-aliasing activated
        this.engine = new Engine(canvas, true)

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // create the scene
        this.status.scene = new Scene(this.engine);
    }

    async run(): Promise<void> {
        await this.gotoStart();

        // running render loop
        this.engine.runRenderLoop(() => {
            this.status.scene!.render();
        });
    }
}