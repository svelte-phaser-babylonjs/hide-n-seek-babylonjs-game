import { ActionManager, ExecuteCodeAction, Scalar, Scene } from "babylonjs";
import { GameState } from "../defs";

export default class {
    private scene: Scene;

    public inputMap: any = {};

    // movement
    public horizontal: number = 0;
    public vertical: number = 0;

    // axis
    public hAxis: number = 0;
    public vAxis: number = 0;

    private keyMap: any = {};

    constructor(scene: Scene, state: GameState, playerNumber: number) {
        this.scene = scene;
        this.keyMap = playerNumber === 1 ? state.input1 : state.input2;

        if (!this.scene.actionManager) {
            this.scene.actionManager = new ActionManager(scene);
        }

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, event => {
                this.inputMap[event.sourceEvent.key] = event.sourceEvent.type === 'keydown';
            })
        );

        this.scene.actionManager.registerAction(
            new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, event => {
                this.inputMap[event.sourceEvent.key] = event.sourceEvent.type === 'keydown';
            })
        );

        if (state.isMobile) {
            this.updateFromVirtualJoystick(state, playerNumber);
            return;
        }

        this.scene.onBeforeRenderObservable.add(() => {
            this.updateFromKeyboard();
        });
    }

    updateFromKeyboard() {
        if (!this.keyMap) return;

        if (this.inputMap[this.keyMap.up]) {
            this.vAxis = 1;
            this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
        } else if (this.inputMap[this.keyMap.down]) {
            this.vAxis = -1;
            this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
        } else {
            this.vAxis = 0;
            this.vertical = 0;
        }

        if (this.inputMap[this.keyMap.left]) {
            this.hAxis = -1;
            this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
        } else if (this.inputMap[this.keyMap.right]) {
            this.hAxis = 1;
            this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
        } else {
            this.hAxis = 0;
            this.horizontal = 0;
        }
    }

    private async updateFromVirtualJoystick(state: GameState, playerNumber: number) {
        let positionArray = await state.setupJoystick!(!state.isTwoPlayer, playerNumber);

        this.scene.onBeforeRenderObservable.add(() => {
            if (positionArray[1] > 0) {
                this.vAxis = 1;
                this.vertical = Scalar.Lerp(this.vertical, 1, 0.2);
            } else if (positionArray[1] < 0) {
                this.vAxis = -1;
                this.vertical = Scalar.Lerp(this.vertical, -1, 0.2);
            } else {
                this.vAxis = 0;
                this.vertical = 0;
            }

            if (positionArray[0] < 0) {
                this.hAxis = -1;
                this.horizontal = Scalar.Lerp(this.horizontal, -1, 0.2);
            } else if (positionArray[0] > 0) {
                this.hAxis = 1;
                this.horizontal = Scalar.Lerp(this.horizontal, 1, 0.2);
            } else {
                this.hAxis = 0;
                this.horizontal = 0;
            }
        })
    }
}