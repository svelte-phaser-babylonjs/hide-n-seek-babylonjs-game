import * as B from 'babylonjs'
import 'babylonjs-loaders';

export class HideNSickGameApp {
    private engine: B.Engine;
    private scene: B.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        // create BabylonJS engine with anti-aliasing activated
        this.engine = new B.Engine(canvas, true)

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

const createCamera = function (scene: B.Scene) {
    const camera = new B.ArcRotateCamera('camera', Math.PI, Math.PI, 1, B.Vector3.Zero(), scene);

    camera.attachControl(true);

    return camera;
}

const createLight = function (scene: B.Scene) {
    const light = new B.HemisphericLight('light', new B.Vector3(0, 1, 0), scene);
    return light;
}


const createScene = function (engine: B.Engine, canvas: HTMLCanvasElement) {
    // This creates a basic Babylon Scene object (non-mesh)
    const scene = new B.Scene(engine);

    createCamera(scene);

    createLight(scene);

    return scene;
};