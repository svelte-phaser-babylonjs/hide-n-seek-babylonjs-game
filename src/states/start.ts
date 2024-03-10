import { Game } from "../Game";
import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Control, Image, Rectangle } from 'babylonjs-gui';
import { simpleButton } from "../helpers/gui_generator";
import { FONT_SIZE_PERCENTAGE } from "../defs";

const createCamera = function (scene: Scene) {
    const camera = new ArcRotateCamera('camera', Math.PI, Math.PI, 1, Vector3.Zero(), scene);

    camera.attachControl(true);

    return camera;
}

const createBackground = function (container: AdvancedDynamicTexture) {
    const bg = new Rectangle('background');
    bg.color = '#9dc9b5';
    bg.background = '#9dc9b5';

    container.addControl(bg);

    return bg;
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

const createPlayButton = async function (container: AdvancedDynamicTexture) {
    const playBtn = await simpleButton('play-btn', 'Play', FONT_SIZE_PERCENTAGE, 0.12, -(window.innerHeight / 10), Control.VERTICAL_ALIGNMENT_BOTTOM);

    window.addEventListener("resize", () => {
        playBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * FONT_SIZE_PERCENTAGE;
        playBtn.top = -(window.innerHeight / 10);
    });

    container.addControl(playBtn);
    return playBtn;
}

const createTheAnimatedImage = function (container: AdvancedDynamicTexture) {
    const animImg = new Image('anim-img', 'assets/sprites/character/character1_watching.png');

    animImg.cellId = 1;
    animImg.cellWidth = 600;
    animImg.cellHeight = 600;


    setInterval(() => {
        if (animImg.cellId < 7) animImg.cellId++;
        else animImg.cellId = 1;
    }, 700);

    animImg.height = 0.5 * window.innerHeight + "px";
    animImg.width = 0.5 * window.innerHeight + "px";
    window.addEventListener("resize", () => {
        animImg.height = 0.5 * window.innerHeight + "px";
        animImg.width = 0.5 * window.innerHeight + "px";
    });

    container.addControl(animImg);

    return animImg;
}

const createGUI = async function (this: Game, scene: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);
    createCamera(scene);

    createBackground(guiMenu);
    createLogo(guiMenu);
    createTheAnimatedImage(guiMenu);

    const playBtn = await createPlayButton(guiMenu);
    playBtn.onPointerClickObservable.add(() => {
        // change the scene to main menu
        this.gotoMainMenu();
    });
}

export default async function (this: Game) {
    this.soundManager.playAmbientMusic();
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    createGUI.call(this, sceneToLoad);

    await this.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = sceneToLoad;
}