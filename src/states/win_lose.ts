import { Game } from "../Game";
import { ArcRotateCamera, Scene, Vector3 } from "babylonjs";
import { AdvancedDynamicTexture, Control, Grid, Image } from 'babylonjs-gui';
import { rectangle, simpleButton, simpleTextBlock } from "../helpers/gui_generator";
import { FONT_SIZE_PERCENTAGE } from "../defs";

const createCamera = function (scene: Scene) {
    const camera = new ArcRotateCamera('camera', Math.PI, Math.PI, 1, Vector3.Zero(), scene);

    camera.attachControl(true);

    return camera;
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

const createGUI = async function (this: Game, scene: Scene, message: string) {
    const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI('ui', true, scene);
    createCamera(scene);

    const bgImg = await rectangle("background", 1, 1, 0, "#9dc9b5");
    guiMenu.addControl(bgImg);

    createLogo(guiMenu);

    const grid = new Grid();
    grid.background = "#64B1A2";
    grid.width = 0.95;
    grid.height = 0.95;
    grid.zIndex = 10;

    grid.addColumnDefinition(1);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.5);
    grid.addRowDefinition(0.4);
    guiMenu.addControl(grid);

    const text = await simpleTextBlock("message-text-node", message, "white", FONT_SIZE_PERCENTAGE, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    text.textWrapping = true;
    grid.addControl(text, 0, 0);

    const score = await simpleTextBlock("message-score-node", `Player1 Score: ${this.state.score1}`, "white", FONT_SIZE_PERCENTAGE * 1.5, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
    score.textWrapping = true;
    grid.addControl(score, 1, 0);

    if (this.state.isTwoPlayer) {
        const score = await simpleTextBlock("message-score2-node", `Player2 Score: ${this.state.score2}`, "white", FONT_SIZE_PERCENTAGE * 1.5, 0.5, 0, Control.VERTICAL_ALIGNMENT_CENTER);
        score.textWrapping = true;
        grid.addControl(score, 2, 0);
    }

    const backBtn = await simpleButton('back-btn', 'Back to Menu', FONT_SIZE_PERCENTAGE / 2, 0.2, -(window.innerHeight / 10), Control.VERTICAL_ALIGNMENT_BOTTOM);
    grid.addControl(backBtn, 3, 0);

    backBtn.onPointerClickObservable.add(() => {
        this.state.soundManager!.playBackSound();

        // change the scene to main menu
        this.gotoMainMenu();
    });
}

export default async function (this: Game) {
    let message: string = "Game Over";

    if (!this.state.isTwoPlayer) {
        if (this.state.score1 === this.state.winScore) {
            message = "You Won! Congratulations!"
        }
    } else {
        if (this.state.score1 > this.state.score2) {
            message = "Player1 Won!"
        } else if (this.state.score2 > this.state.score1) {
            message = "Player2 Won!"
        } else {
            message = "Game is Tie!"
        }

        if (this.state.score1 === this.state.winScore || this.state.score2 === this.state.winScore) {
            message += " Caught All!"
        }
    }

    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    await createGUI.call(this, sceneToLoad, message);

    await this.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = sceneToLoad;
}
