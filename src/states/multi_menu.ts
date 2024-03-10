import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { AdvancedDynamicTexture, Control, Grid, Image, Rectangle, ScrollViewer } from "babylonjs-gui";
import { image, imageButton, rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
import { FONT_SIZE_PERCENTAGE } from "../defs";

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

async function createModal(this: Game, container: AdvancedDynamicTexture) {
    const containerGrid = new Rectangle('grid-container');
    containerGrid.background = "#64B1A2";
    containerGrid.thickness = 15;
    containerGrid.cornerRadius = 50;
    containerGrid.width = 0.8;
    containerGrid.height = 0.8;
    containerGrid.zIndex = 2;
    containerGrid.topInPixels = 0.05 * window.innerHeight;
    container.addControl(containerGrid);

    const grid = new Grid();
    grid.background = "#64B1A2";
    grid.width = 0.95;
    grid.height = 0.95;
    grid.zIndex = 3;
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.addRowDefinition(0.66);
    grid.addRowDefinition(0.14);
    grid.addRowDefinition(0.2);
    containerGrid.addControl(grid);

    for (let i = 1; i < 3; ++i) {
        const playerImage = await image(`image-player-${i}`, `assets/textures/UI/player${i}.svg`, 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
        playerImage.stretch = Image.STRETCH_UNIFORM;
        grid.addControl(playerImage, 0, i - 1);

        const playerName = await simpleTextBlock(`name-player-${i}`, `Player ${i}`, "white", FONT_SIZE_PERCENTAGE * 0.4, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
        playerName.textWrapping = true;
        grid.addControl(playerName, 1, i - 1);

        const playerControls = await image(`control-player-${i}`, `assets/textures/UI/controls${i}.svg`, 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
        playerControls.stretch = Image.STRETCH_UNIFORM;
        grid.addControl(playerControls, 2, i - 1);
    }

    const levelMenuBtn = await simpleButton("level-btn", "Choose a level", FONT_SIZE_PERCENTAGE / 1.5, 1, window.innerHeight * 0.1, Control.VERTICAL_ALIGNMENT_CENTER);
    levelMenuBtn.zIndex = 5;
    levelMenuBtn.height = 0.2;
    levelMenuBtn.width = 0.3;
    levelMenuBtn.onPointerClickObservable.add(() => {
        this.state.soundManager!.playConfirmSound();

        this.state.isTwoPlayer = true;
        this.gotoSoloMenu();
    });
    container.addControl(levelMenuBtn);

    window.addEventListener("resize", () => {
        levelMenuBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE / 1.5;
    })

    return containerGrid;
}

async function createGUI(this: Game, scene: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);

    createBackground(guiMenu);

    const multiTitle = await simpleTextBlock("multi-title", "Local Multi Player", "white", FONT_SIZE_PERCENTAGE, 0.15, 0, Control.VERTICAL_ALIGNMENT_TOP);
    guiMenu.addControl(multiTitle);

    await createModal.call(this, guiMenu);

    const backBtn = await simpleButton('back-btn', '> Back', FONT_SIZE_PERCENTAGE / 1.5, 1, 0, Control.VERTICAL_ALIGNMENT_TOP);
    backBtn.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
    backBtn.zIndex = 9;
    backBtn.height = 0.2;
    backBtn.width = 0.3;
    backBtn.onPointerClickObservable.add(() => {
        this.state.soundManager!.playBackSound();

        this.gotoMainMenu();
    });
    guiMenu.addControl(backBtn);

    window.addEventListener("resize", () => {
        multiTitle.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE;
        backBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE / 1.5;
    });
}

export default async function (this: Game) {
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    createCamera(sceneToLoad);
    await createGUI.call(this, sceneToLoad);

    await this.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = sceneToLoad;

}