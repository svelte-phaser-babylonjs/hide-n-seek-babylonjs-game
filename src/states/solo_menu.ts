import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { State } from "../defs";
import { AdvancedDynamicTexture, Control, Grid, Image, Rectangle, ScrollViewer } from "babylonjs-gui";
import { imageButton, simpleButton, simpleTextBlock } from "../helpers/gui_generator";

const createCamera = function (scene: Scene) {
    const camera = new ArcRotateCamera('camera', Math.PI, Math.PI, 1, Vector3.Zero(), scene);

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

async function createGUI(this: Game, scene: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);

    createBackground(guiMenu);

    const fontSizePercentage = 0.06;
    const soloTitle = await simpleTextBlock("solo-title", "Choose your level", "white", fontSizePercentage, 0.1, (window.innerHeight / 20), Control.VERTICAL_ALIGNMENT_TOP);
    guiMenu.addControl(soloTitle);

    const scrollViewer = new ScrollViewer("scroll-viewer-solo");
    scrollViewer.background = "#64B1A2";
    scrollViewer.width = 0.8;
    scrollViewer.height = 0.7;
    scrollViewer.thickness = 15;
    scrollViewer.top = -(window.innerHeight / 10);
    scrollViewer.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
    guiMenu.addControl(scrollViewer);

    const level1Btn = await imageButton("level1-btn", "The Rabbit Invasion", "assets/textures/UI/level1.svg", fontSizePercentage / 2, 0.3, 0, Control.HORIZONTAL_ALIGNMENT_LEFT);
    level1Btn.onPointerClickObservable.add(() => {
        modal.isVisible = true;
        containerGrid.isVisible = true;
    });
    scrollViewer.addControl(level1Btn);

    const containerGrid = new Rectangle('grid-container');
    containerGrid.isVisible = false;
    containerGrid.background = "#64B1A2";
    containerGrid.thickness = 15;
    containerGrid.cornerRadius = 50;
    containerGrid.width = 0.7;
    containerGrid.height = 0.7;
    containerGrid.zIndex = 5;
    guiMenu.addControl(containerGrid);

    const modal = new Rectangle("modal");
    modal.zIndex = 3;
    modal.width = 1;
    modal.height = 1;
    modal.thickness = 0;
    modal.background = "black";
    modal.alpha = 0.3;
    modal.isVisible = false;

    modal.onPointerClickObservable.add(() => {
        containerGrid.isVisible = false;
        modal.isVisible = false;
    });
    guiMenu.addControl(modal);

    const grid = new Grid();
    grid.background = "#64B1A2";
    grid.width = 0.95;
    grid.height = 0.95;
    grid.zIndex = 10;
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    containerGrid.addControl(grid);
}

export default async function (this: Game) {
    this.status.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    createCamera(sceneToLoad);
    await createGUI.call(this, sceneToLoad);

    await this.status.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.status.scene!.dispose();
    this.status.scene = sceneToLoad;

    this.state = State.SOLO_MENU;
}