import { State, Status } from './defs';
import { mainMenu, start } from './states';
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
    protected start = start;
    protected mainMenu = mainMenu;

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
        await this.goToStart();

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

    protected async goToStart(): Promise<void> {
        await this.start();
    }

    protected async goToMainMenu(): Promise<void> {
        await this.mainMenu();
    }
}