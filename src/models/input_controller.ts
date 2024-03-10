import { ActionManager, ExecuteCodeAction, Scalar, Scene } from "babylonjs";

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

    constructor(scene: Scene, keyMap: any) {
        this.scene = scene;
        this.keyMap = keyMap;

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
}