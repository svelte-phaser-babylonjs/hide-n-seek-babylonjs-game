import { Game } from "../Game";
import { ArcRotateCamera, DeviceSourceManager, DeviceType, Scene, Vector3 } from "babylonjs";
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

    const inputsTitle = await simpleTextBlock("input-title", "Inputs", "white", FONT_SIZE_PERCENTAGE * 0.4, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    inputsTitle.textWrapping = true;
    inputsTitle.zIndex = 5;
    grid.addControl(inputsTitle, 2, 0);

    const gridInputs = new Grid();
    gridInputs.background = "#64B1A2";
    gridInputs.width = 1;
    gridInputs.height = 1;
    gridInputs.zIndex = 5;
    gridInputs.addColumnDefinition(0.2);
    gridInputs.addColumnDefinition(0.2);
    gridInputs.addColumnDefinition(0.2);
    gridInputs.addColumnDefinition(0.2);
    gridInputs.addColumnDefinition(0.2);
    gridInputs.addRowDefinition(0.1);
    gridInputs.addRowDefinition(0.45);
    gridInputs.addRowDefinition(0.45);
    grid.addControl(gridInputs, 3, 0);

    const upImage = await image("up", "assets/textures/UI/up.svg", 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
    gridInputs.addControl(upImage, 0, 1);
    const downImage = await image("down", "assets/textures/UI/down.svg", 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
    gridInputs.addControl(downImage, 0, 2);
    const leftImage = await image("left", "assets/textures/UI/left.svg", 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
    gridInputs.addControl(leftImage, 0, 3);
    const rightImage = await image("right", "assets/textures/UI/right.svg", 1, 1, 0, 0, Control.HORIZONTAL_ALIGNMENT_CENTER, Control.VERTICAL_ALIGNMENT_CENTER);
    gridInputs.addControl(rightImage, 0, 4);

    const player1Title = await simpleTextBlock("player1-title", "Player 1", "#33896B", FONT_SIZE_PERCENTAGE * 0.5, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    player1Title.textWrapping = true;
    gridInputs.addControl(player1Title, 1, 0);

    const player2Title = await simpleTextBlock("player2-title", "Player 2", "#33896B", FONT_SIZE_PERCENTAGE * 0.5, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    player2Title.textWrapping = true;
    gridInputs.addControl(player2Title, 2, 0);

    // 1|up, 1|down ,...
    let state = "";

    // PLAYER 1 KEYS
    const player1Button_up = await simpleButton("player1-up-key", this.state.input1.up, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player1Button_up.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "1|up";
        player1Button_up.color = "red";
        player1Button_up.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player1Button_up, 1, 1);

    const player1Button_down = await simpleButton("player1-down-key", this.state.input1.down, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player1Button_down.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "1|down";
        player1Button_down.color = "red";
        player1Button_down.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player1Button_down, 1, 2);

    const player1Button_left = await simpleButton("player1-left-key", this.state.input1.left, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player1Button_left.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "1|left";
        player1Button_left.color = "red";
        player1Button_left.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player1Button_left, 1, 3);

    const player1Button_right = await simpleButton("player1-right-key", this.state.input1.right, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player1Button_right.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "1|right";
        player1Button_right.color = "red";
        player1Button_right.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player1Button_right, 1, 4);

    // PLAYER 2 KEYS
    const player2Button_up = await simpleButton("player2-up-key", this.state.input2.up, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player2Button_up.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "2|up";
        player2Button_up.color = "red";
        player2Button_up.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player2Button_up, 2, 1);

    const player2Button_down = await simpleButton("player2-down-key", this.state.input2.down, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player2Button_down.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "2|down";
        player2Button_down.color = "red";
        player2Button_down.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player2Button_down, 2, 2);

    const player2Button_left = await simpleButton("player2-left-key", this.state.input2.left, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player2Button_left.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "2|left";
        player2Button_left.color = "red";
        player2Button_left.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player2Button_left, 2, 3);

    const player2Button_right = await simpleButton("player2-right-key", this.state.input2.right, FONT_SIZE_PERCENTAGE * 0.25, 1, 0, Control.VERTICAL_ALIGNMENT_CENTER, true);
    player2Button_right.onPointerClickObservable.add(() => {
        if (state !== "") return;
        state = "2|right";
        player2Button_right.color = "red";
        player2Button_right.textBlock!.text = "Press a key";
    });
    gridInputs.addControl(player2Button_right, 2, 4);

    // CHANGE KEY EVENTS
    const deviceSourceManager = await new DeviceSourceManager(this.engine);
    deviceSourceManager.onDeviceConnectedObservable.add(deviceSource => {
        if (deviceSource.deviceType === DeviceType.Keyboard) {
            deviceSource.onInputChangedObservable.add((eventData: { key: any }) => {
                if (state === "") return;

                const [playerNumber, key] = state.split('|');

                if (playerNumber === "1") {
                    if (key === "up") {
                        this.state.input1.up = eventData.key;
                        player1Button_up.color = "white";
                        player1Button_up.textBlock!.text = eventData.key;
                    } else if (key === "down") {
                        this.state.input1.down = eventData.key;
                        player1Button_down.color = "white";
                        player1Button_down.textBlock!.text = eventData.key;
                    } else if (key === "left") {
                        this.state.input1.left = eventData.key;
                        player1Button_left.color = "white";
                        player1Button_left.textBlock!.text = eventData.key;
                    } if (key === "right") {
                        this.state.input1.right = eventData.key;
                        player1Button_right.color = "white";
                        player1Button_right.textBlock!.text = eventData.key;
                    }
                } else {
                    if (key === "up") {
                        this.state.input2.up = eventData.key;
                        player2Button_up.color = "white";
                        player2Button_up.textBlock!.text = eventData.key;
                    } else if (key === "down") {
                        this.state.input2.down = eventData.key;
                        player2Button_down.color = "white";
                        player2Button_down.textBlock!.text = eventData.key;
                    } else if (key === "left") {
                        this.state.input2.left = eventData.key;
                        player2Button_left.color = "white";
                        player2Button_left.textBlock!.text = eventData.key;
                    } if (key === "right") {
                        this.state.input2.right = eventData.key;
                        player2Button_right.color = "white";
                        player2Button_right.textBlock!.text = eventData.key;
                    }
                }

                state = "";
            })
        }
    })

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

    const backBtn = await simpleButton('back-btn', '> Back', FONT_SIZE_PERCENTAGE / 1.5, 0.2, 0.3, Control.VERTICAL_ALIGNMENT_TOP);
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