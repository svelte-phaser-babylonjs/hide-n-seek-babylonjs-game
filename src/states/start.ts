import { HideNSickGameApp } from "../HideNSickGameApp";
import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Rectangle } from 'babylonjs-gui';

const createCamera = function (scene: Scene) {
    const camera = new ArcRotateCamera('camera', Math.PI, Math.PI, 1, Vector3.Zero(), scene);

    camera.attachControl(true);

    return camera;
}

export default async function (this: HideNSickGameApp) {

    this.status.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, sceneToLoad);

    const bg = new Rectangle('background');
    bg.color = '#9dc9b5';
    bg.background = '#9dc9b5';
    guiMenu.addControl(bg);

    createCamera(sceneToLoad);

    await this.status.scene!.whenReadyAsync();
    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.status.scene!.dispose();
    this.status.scene = sceneToLoad;
}