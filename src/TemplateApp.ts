import * as BABYLON from 'babylonjs'
import 'babylonjs-loaders';

export class TemplateApp {
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        // create BabylonJS engine with anti-aliasing activated
        this.engine = new BABYLON.Engine(canvas, true)

        window.addEventListener('resize', () => {
            this.engine.resize();
        });

        // create the scene
        this.scene = createScene(this.engine, this.canvas)
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

        // running render loop
        this.engine.runRenderLoop(() => {
            this.scene.render();
        });
    }
}

const createCamera = function (scene: BABYLON.Scene) {
    const camera = new BABYLON.FreeCamera('camera', BABYLON.Vector3.Zero(), scene);
    return camera;
}

const createLight = function (scene: BABYLON.Scene) {
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 1, 0), scene);
    return light;
}


const createScene = function (engine: BABYLON.Engine, canvas: HTMLCanvasElement) {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new BABYLON.Scene(engine);

    createCamera(scene);

    createLight(scene);

    return scene;
};