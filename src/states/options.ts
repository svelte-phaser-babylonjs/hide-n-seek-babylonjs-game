import { Game } from "../Game";
import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Control, Grid, Rectangle } from 'babylonjs-gui';
import { image, simpleButton, simpleSlider, simpleTextBlock } from "../helpers/gui_generator";
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

const createTitle = async function (container: AdvancedDynamicTexture) {
    const optionsTitle = await simpleTextBlock("options-title", "Options", "white", FONT_SIZE_PERCENTAGE, 0.15, 0, Control.VERTICAL_ALIGNMENT_TOP);

    optionsTitle.textWrapping = true;
    optionsTitle.zIndex = 5;

    container.addControl(optionsTitle);
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

async function createGrid(this: Game, container: AdvancedDynamicTexture) {
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
    grid.addColumnDefinition(1);
    grid.addRowDefinition(0.1);
    grid.addRowDefinition(0.4);
    grid.addRowDefinition(0.1);
    grid.addRowDefinition(0.4);
    containerGrid.addControl(grid);

    const soundTitle = await simpleTextBlock("sound-title", "Sounds", "white", FONT_SIZE_PERCENTAGE * 0.4, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    soundTitle.textWrapping = true;
    soundTitle.zIndex = 5;
    grid.addControl(soundTitle, 0, 0);

    const gridSound = new Grid();
    gridSound.background = "#64B1A2";
    gridSound.width = 1;
    gridSound.height = 1;
    gridSound.zIndex = 5;
    gridSound.addColumnDefinition(0.2);
    gridSound.addColumnDefinition(0.75);
    gridSound.addColumnDefinition(0.05);
    gridSound.addRowDefinition(0.33);
    gridSound.addRowDefinition(0.33);
    gridSound.addRowDefinition(0.33);
    grid.addControl(gridSound, 1, 0);

    const valueSliderAmbient = await simpleTextBlock("ambient-slider-title", `${this.state.soundManager!.getAmbientSoundTrackVol()}`, "white", FONT_SIZE_PERCENTAGE * 0.5, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    gridSound.addControl(valueSliderAmbient, 0, 2);
    const sliderAmbientVol = await simpleSlider("ambient-sound", "Ambient Sound Volume", this.state.soundManager!.getAmbientSoundTrackVol(), gridSound, 0, FONT_SIZE_PERCENTAGE);
    sliderAmbientVol.onValueChangedObservable.add(value => {
        const volume = Math.round(value).toString();
        valueSliderAmbient.text = volume;
        this.state.soundManager!.setAmbientSoundTrackVol(value);
    });

    const valueSliderMusic = await simpleTextBlock("music-slider-title", `${this.state.soundManager!.getMusicSoundTrackVol()}`, "white", FONT_SIZE_PERCENTAGE * 0.5, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    gridSound.addControl(valueSliderMusic, 1, 2);
    const sliderMusicVol = await simpleSlider("music-sound", "Game Music Volume", this.state.soundManager!.getMusicSoundTrackVol(), gridSound, 1, FONT_SIZE_PERCENTAGE);
    sliderMusicVol.onValueChangedObservable.add(value => {
        const volume = Math.round(value).toString();
        valueSliderMusic.text = volume;
        this.state.soundManager!.setMusicSoundTrackVol(value);
    });

    const valueSliderSFX = await simpleTextBlock("sfx-slider-title", `${this.state.soundManager!.getSfxSoundTrackVol()}`, "white", FONT_SIZE_PERCENTAGE * 0.5, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    gridSound.addControl(valueSliderSFX, 2, 2);
    const sliderSFXVol = await simpleSlider("sfx-sound", "SFX Volume", this.state.soundManager!.getSfxSoundTrackVol(), gridSound, 2, FONT_SIZE_PERCENTAGE);
    sliderSFXVol.onValueChangedObservable.add(value => {
        const volume = Math.round(value).toString();
        valueSliderSFX.text = volume;
        this.state.soundManager!.setSfxSoundTrackVol(value);
    });


    // for (let i = 1; i < 3; ++i) {
    //     const playerImage = await image(`image-player-${i}`, `assets/textures/UI/player${i}.svg`, 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
    //     playerImage.stretch = Image.STRETCH_UNIFORM;
    //     grid.addControl(playerImage, 0, i - 1);

    //     const playerName = await simpleTextBlock(`name-player-${i}`, `Player ${i}`, "white", FONT_SIZE_PERCENTAGE * 0.4, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    //     playerName.textWrapping = true;
    //     grid.addControl(playerName, 1, i - 1);

    //     const playerControls = await image(`control-player-${i}`, `assets/textures/UI/controls${i}.svg`, 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
    //     playerControls.stretch = Image.STRETCH_UNIFORM;
    //     grid.addControl(playerControls, 2, i - 1);
    // }

    // const levelMenuBtn = await simpleButton("level-btn", "Choose a level", FONT_SIZE_PERCENTAGE / 1.5, 1, window.innerHeight * 0.1, Control.VERTICAL_ALIGNMENT_CENTER);
    // levelMenuBtn.zIndex = 5;
    // levelMenuBtn.height = 0.2;
    // levelMenuBtn.width = 0.3;
    // levelMenuBtn.onPointerClickObservable.add(() => {
    //     this.state.soundManager!.playConfirmSound();

    //     this.state.isTwoPlayer = true;
    //     this.gotoSoloMenu();
    // });
    // container.addControl(levelMenuBtn);

    window.addEventListener("resize", () => {
        // levelMenuBtn.fontSizeInPixels = ((window.innerWidth + window.innerHeight) / 2) * FONT_SIZE_PERCENTAGE / 1.5;
    });

    return containerGrid;
}

const createGUI = async function (this: Game, scene: Scene) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);
    createCamera(scene);

    createBackground(guiMenu);
    createTitle(guiMenu);
    createGrid.call(this, guiMenu);

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

    const playBtn = await createPlayButton(guiMenu);
    playBtn.onPointerClickObservable.add(() => {
        this.state.soundManager!.playConfirmSound();

        // change the scene to main menu
        this.gotoMainMenu();
    });
}

export default async function (this: Game) {
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    await createGUI.call(this, sceneToLoad);

    await this.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = sceneToLoad;
}