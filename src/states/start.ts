import { Game } from "../Game";
import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Control, Image, Rectangle } from 'babylonjs-gui';
import { image, rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
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
        this.state.soundManager!.playConfirmSound();

        // change the scene to main menu
        this.gotoMainMenu();
    });

    if (!this.isMobile) return;

    const modal = await rectangle("modal", 1, 1, 0, "Black");
    modal.alpha = 0.8;
    guiMenu.addControl(modal);

    modal.onPointerClickObservable.add(async () => {
        modal.isVisible = false;
    });

    const mobileLandscapeImg = await image("landscape-mode", "assets/textures/UI/landscapeScreen.svg", 0.8, 0.8, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_TOP);
    modal.addControl(mobileLandscapeImg);

    const textMobile = await simpleTextBlock("mobile-title-warn", "Please keep your device in landscape mode for best experience", "white", FONT_SIZE_PERCENTAGE * 0.75, 0.5, (window.innerHeight / 10), Control.VERTICAL_ALIGNMENT_BOTTOM);
    textMobile.textWrapping = true;
    textMobile.width = 0.8;
    modal.addControl(textMobile);

    window.addEventListener("resize", () => {
        mobileLandscapeImg.top = 0;
        mobileLandscapeImg.width = 0.8;

        textMobile.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * FONT_SIZE_PERCENTAGE * 0.75;
        textMobile.top = window.innerHeight / 10;
        textMobile.width = 0.8;
    });
}

export default async function (this: Game) {
    await this.state.soundManager!.loadSounds();

    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    await createGUI.call(this, sceneToLoad);

    await this.scene!.whenReadyAsync();

    this.state.soundManager!.playAmbientMusic();
    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = sceneToLoad;
}