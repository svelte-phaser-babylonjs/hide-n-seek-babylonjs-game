import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { AdvancedDynamicTexture, Control, Grid, Image, Rectangle, ScrollViewer } from "babylonjs-gui";
import { imageButton, simpleButton, simpleTextBlock } from "../helpers/gui_generator";

const fontSizePercentage = 0.06;

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

async function createModal(container: AdvancedDynamicTexture) {
    const containerGrid = new Rectangle('grid-container');
    containerGrid.isVisible = false;
    containerGrid.background = "#64B1A2";
    containerGrid.thickness = 15;
    containerGrid.cornerRadius = 50;
    containerGrid.width = 0.7;
    containerGrid.height = 0.7;
    containerGrid.zIndex = 5;
    container.addControl(containerGrid);

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
    container.addControl(modal);

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

    const controls = new Image("controls", "assets/textures/UI/controls1.svg");
    controls.stretch = Image.STRETCH_UNIFORM;
    controls.width = 1;
    grid.addControl(controls, 0, 0);

    const goalText = await simpleTextBlock("solo-indications", "Find and catch all the rabbits before running out of time.", "white", fontSizePercentage / 2, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    goalText.textWrapping = true;
    grid.addControl(goalText, 0, 1);

    const timeText = await simpleTextBlock("solo-time", "60 Seconds", "white", fontSizePercentage / 2, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    timeText.textWrapping = true;
    grid.addControl(timeText, 1, 0);

    const startBtn = await simpleButton("start-btn", "Start", fontSizePercentage, 1, 1, Control.VERTICAL_ALIGNMENT_CENTER);
    startBtn.onPointerClickObservable.add(() => {
        // launch level 1
    });
    grid.addControl(startBtn, 1, 1);

    window.addEventListener("resize", () => {
        startBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSizePercentage;
        goalText.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSizePercentage / 2;
        timeText.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSizePercentage;
    })

    return { modal, containerGrid };
}

async function createGUI(this: Game, scene: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);

    createBackground(guiMenu);

    const soloTitle = await simpleTextBlock("solo-title", "Choose your level", "white", fontSizePercentage, 0.1, (window.innerHeight / 20), Control.VERTICAL_ALIGNMENT_TOP);
    guiMenu.addControl(soloTitle);

    const { modal, containerGrid } = await createModal(guiMenu);

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

    const backBtn = await simpleButton('back-btn', '> Back', fontSizePercentage / 1.5, 0.1, (0.4 * window.innerHeight), Control.VERTICAL_ALIGNMENT_TOP);
    backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    backBtn.leftInPixels = -80;
    backBtn.onPointerClickObservable.add(() => {
        this.gotoMainMenu();
    });
    guiMenu.addControl(backBtn);

    window.addEventListener("resize", () => {
        soloTitle.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSizePercentage;
        level1Btn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSizePercentage / 2;
        backBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * fontSizePercentage / 1.5;
    });
}

export default async function (this: Game) {
    this.uiScene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    createCamera(sceneToLoad);
    await createGUI.call(this, sceneToLoad);

    await this.uiScene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.uiScene!.dispose();
    this.uiScene = sceneToLoad;

}