import { State, Status } from './defs';
import { start } from './states';
import { Engine, Scene } from 'babylonjs';
import 'babylonjs-loaders';

export class HideNSickGameApp {
    engine: Engine;
    state: State;

    status: Status = {
        scene: null,
        state: State.START,
    }

    protected start = start;

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

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.status.scene!.debugLayer.show({ overlay: true });
        } else {
            this.status.scene!.debugLayer.hide();
        }
    }

    run() {
        this.debug(false);

        this.start();

        // running render loop
        this.engine.runRenderLoop(() => {
            switch (this.state) {
                case State.START:
                    this.status.scene!.render();
                    break;

                case State.MAIN_MENU:
                    break;

                case State.SOLO_MENU:
                    break;

                case State.MULTI_MENU:
                    break;

                case State.OPTIONS:
                    break;

                case State.GAME_SOLO:
                    break;

                case State.GAME_MULTI:
                    break;

                case State.LOSE:
                    break;

                case State.WIN:
                    break;

                default:
                    break;
            }
        });
    }
}