import * as B from 'babylonjs'
import 'babylonjs-loaders';
import { State } from './defs';
import { start } from './states';

export class HideNSickGameApp {
    engine: B.Engine;
    scene: B.Scene;
    state: State;

    protected start = start;

    constructor(readonly canvas: HTMLCanvasElement) {
        // create BabylonJS engine with anti-aliasing activated
        this.engine = new B.Engine(canvas, true)

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // create the scene
        this.scene = new B.Scene(this.engine);

        // state
        this.state = State.START;
    }

    debug(debugOn: boolean = true) {
        if (debugOn) {
            this.scene.debugLayer.show({ overlay: true });
        } else {
            this.scene.debugLayer.hide();
        }
    }

    run() {
        this.debug(true);

        this.start();

        // running render loop
        this.engine.runRenderLoop(() => {
            switch (this.state) {
                case State.START:
                    this.scene.render();
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