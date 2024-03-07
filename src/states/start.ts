import { HideNSickGameApp } from "../HideNSickGameApp";
import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Button, Control, Image, Rectangle } from 'babylonjs-gui';

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
}

const createLogo = function (container: AdvancedDynamicTexture) {
    const titleImg = new Image('logo-title', 'assets/textures/UI/logo.svg');

    titleImg.stretch = Image.STRETCH_UNIFORM;
    titleImg.height = 0.3;
    titleImg.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
    titleImg.top = (window.innerHeight / 10);

    container.addControl(titleImg);
}

const createPlayButton = function (container: AdvancedDynamicTexture) {
    const playBtn = Button.CreateSimpleButton('play-btn', "Play");

    playBtn.height = 0.12;
    playBtn.width = 0.24;

    playBtn.top = -(window.innerHeight / 10);
    playBtn.thickness = 0;
    playBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

    playBtn.onPointerEnterObservable.add(() => {
        playBtn.color = "yellow";
    });

    playBtn.onPointerOutObservable.add(() => {
        playBtn.color = "white";
    });

    playBtn.onPointerClickObservable.add(() => {
        // change the scene to main menu
    });

    playBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * 0.05;
    playBtn.color = "white";
    document.fonts.load('14px bongkar').then(() => {  // start loading font
        document.fonts.ready.then(() => {
            console.log('Fonts Ready');  // all fonts is ready
            playBtn.fontFamily = "bongkar";
        });
    });
    container.addControl(playBtn);

    return playBtn;
}

const createTheAnimatedImage = function (container: AdvancedDynamicTexture) {
    const animImg = new Image('anim-img', 'assets/sprites/character/character1_watching.png');

    animImg.cellId = 1;
    animImg.cellWidth = 600;
    animImg.cellHeight = 600;

    animImg.height = 0.5 * window.innerHeight + "px";
    animImg.width = 0.5 * window.innerHeight + "px";

    setInterval(() => {
        if (animImg.cellId < 7) animImg.cellId++;
        else animImg.cellId = 1;
    }, 700);


    container.addControl(animImg);

    return animImg;
}

export default async function (this: HideNSickGameApp) {

    this.status.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, sceneToLoad);

    createBackground(guiMenu);
    createLogo(guiMenu);
    const playBtn = createPlayButton(guiMenu);
    const animImg = createTheAnimatedImage(guiMenu);

    window.addEventListener("resize", () => {
        playBtn.fontSizeInPixels = ((window.innerHeight + window.innerWidth) / 2) * 0.05;
        playBtn.top = -(window.innerHeight / 10);

        animImg.height = 0.5 * window.innerHeight + "px";
        animImg.width = 0.5 * window.innerHeight + "px";
    });

    createCamera(sceneToLoad);

    await this.status.scene!.whenReadyAsync();
    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.status.scene!.dispose();
    this.status.scene = sceneToLoad;
}