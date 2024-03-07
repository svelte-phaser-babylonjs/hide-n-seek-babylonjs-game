import * as B from 'babylonjs'
import { HideNSickGameApp } from "../HideNSickGameApp";

const createCamera = function (scene: B.Scene) {
    const camera = new B.ArcRotateCamera('camera', Math.PI, Math.PI, 1, B.Vector3.Zero());

    camera.attachControl(true);

    return camera;
}

export default async function (this: HideNSickGameApp) {
    createCamera(this.scene);
}