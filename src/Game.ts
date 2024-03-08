import { State, Status } from './defs';
import { mainMenu, soloMenu, start } from './states';
import { Engine, Scene } from 'babylonjs';
import 'babylonjs-loaders';

export class Game {
    engine: Engine;
    state: State;

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

        // state
        this.state = State.START;
    }

    async run(): Promise<void> {
        await this.gotoStart();

        // running render loop
        this.engine.runRenderLoop(() => {
            this.status.scene!.render();
            // switch (this.state) {
            //     case State.START:
            //         break;

            //     case State.MAIN_MENU:
            //         break;

            //     case State.SOLO_MENU:
            //         break;

            //     case State.MULTI_MENU:
            //         break;

            //     case State.OPTIONS:
            //         break;

            //     case State.GAME_SOLO:
            //         break;

            //     case State.GAME_MULTI:
            //         break;

            //     case State.LOSE:
            //         break;

            //     case State.WIN:
            //         break;

            //     default:
            //         break;
            // }
        });
    }
}