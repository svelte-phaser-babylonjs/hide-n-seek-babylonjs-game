import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { State } from "../defs";
import { AdvancedDynamicTexture, Control, Image } from "babylonjs-gui";
import { simpleButton } from "../helpers/gui_generator";
import { spriteManagerGenerator } from "../helpers/sprite_generator";

const createCamera = function (scene: Scene) {
    const camera = new ArcRotateCamera('camera', Math.PI, Math.PI, 1, Vector3.Zero(), scene);

    camera.attachControl(true);

    return camera;
}

async function createTheAnimatedBG(scene: Scene) {
    const min = -15;
    const max = 15;
    spriteManagerGenerator(scene, "rabbit", "assets/sprites/animals/rabbit_watching.png", 600, 600, 5, min, max, -0.6, 1, 1, true, 11);
}

const createLogo = function (container: AdvancedDynamicTexture) {
    const titleImg = new Image('logo-title', 'assets/textures/UI/logo.svg');

    titleImg.stretch = Image.STRETCH_UNIFORM;
    titleImg.height = 0.3;
    titleImg.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleImg.top = (window.innerHeight / 10);

    container.addControl(titleImg);

    return titleImg;
}

async function createGUI(this: Game, scene: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);

    const fontSizePercentage = 0.06;

    const soloBtn = await simpleButton('solo-btn', 'Solo', fontSizePercentage, 0.12, 0.15, -((window.innerHeight / 20) * 6), Control.VERTICAL_ALIGNMENT_BOTTOM);
    soloBtn.onPointerClickObservable.add(() => {

    });
    guiMenu.addControl(soloBtn);

    const multiBtn = await simpleButton('multi-btn', 'Multiplayer', fontSizePercentage, 0.12, 0.6, -((window.innerHeight / 20) * 3.5), Control.VERTICAL_ALIGNMENT_BOTTOM);
    multiBtn.onPointerClickObservable.add(() => {

    });
    guiMenu.addControl(multiBtn);

    const optionsBtn = await simpleButton('opt-btn', 'Options', fontSizePercentage, 0.12, 0.4, -(window.innerHeight / 20), Control.VERTICAL_ALIGNMENT_BOTTOM);
    optionsBtn.onPointerClickObservable.add(() => {

    });
    guiMenu.addControl(optionsBtn);

    window.addEventListener("resize", () => {
        soloBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        multiBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
        optionsBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * fontSizePercentage;
    });

    createLogo(guiMenu);
}

export default async function (this: Game) {

    this.status.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);
    createCamera(sceneToLoad);

    await createTheAnimatedBG(sceneToLoad);
    await createGUI.call(this, sceneToLoad);

    await this.status.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.status.scene!.dispose();
    this.status.scene = sceneToLoad;

    this.state = State.START;
}