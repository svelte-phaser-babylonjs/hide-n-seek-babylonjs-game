import { AbstractMesh, Animation, DirectionalLight, FollowCamera, Mesh, MeshBuilder, Scene, SpritePackedManager, Vector2, Vector3 } from "babylonjs";
import { Game } from "../Game";
import { AdvancedDynamicTexture, Control, Image } from "babylonjs-gui";
import { simpleButton } from "../helpers/gui_generator";
import { animatedStandardMaterial, spriteMapGenerator, spritePackRandomGenerator, spriteRandomGenerator } from "../helpers/sprite_generator";

const createCameraAndLight = function (scene: Scene, target: AbstractMesh) {
    const light = new DirectionalLight("light", new Vector3(0, 1, 1), scene);
    light.intensity = 0.4;

    const camera = new FollowCamera('follow-camera', new Vector3(0, -3, -10), scene);

    camera.radius = -4;
    camera.heightOffset = -4;
    camera.rotation.x = -45;
    camera.cameraAcceleration = 0.1;
    camera.noRotationConstraint = true;
    camera.lockedTarget = target;

    return camera;
}

async function createTheAnimatedBGAndPlayerMesh(scene: Scene) {
    const min = -15;
    const max = 15;

    spriteRandomGenerator(scene, "rabbit", "assets/sprites/animals/rabbit_watching.png", 600, 600, 5, min, max, -0.6, 1, 1, true, 11);

    const spritePackManager = new SpritePackedManager("env-sprite-manager", "assets/sprites/environment/envSpritePack.png", 100, scene);

    spritePackRandomGenerator(spritePackManager, "tree-triangle", "tree_triangle.png", 20, min, max, -1.8, 2.52 / 2, 7.76 / 2);
    spritePackRandomGenerator(spritePackManager, "tree-round", "tree_round.png", 20, min, max, -2, 5.52 / 2, 8.93 / 2);
    spritePackRandomGenerator(spritePackManager, "tree-dead", "tree_dead.png", 5, min, max, -1.2, 3.69 / 2, 5.77 / 2);

    spritePackRandomGenerator(spritePackManager, "bush1", "bush_1.png", 20, min, max, -0.1, 2.48 / 4, 2.28 / 4);
    spritePackRandomGenerator(spritePackManager, "bush2", "bush_2.png", 20, min, max, -0.1, 2.14 / 4, 2.16 / 4);
    spritePackRandomGenerator(spritePackManager, "flower-red", "flower_red.png", 20, min, max, -0.1, 0.79 / 4, 2.1 / 4);

    await spriteMapGenerator(
        scene,
        "assets/textures/tile_map_texture.png",
        "assets/tilemaps/tile_map_texture.json",
        "assets/tilemaps/menu_tile_map.tilemaps",
        new Vector2(4, 4),
        new Vector2(40, 40)
    );

    const parentMesh = new Mesh("parent-player-mesh", scene);

    const playerMesh = MeshBuilder.CreatePlane("player-mesh", {
        width: 1,
        height: 1,
        sideOrientation: Mesh.DOUBLESIDE
    }, scene);
    playerMesh.position.z = -0.4;
    playerMesh.rotation.x = -45;

    playerMesh.setParent(parentMesh);

    playerMesh.material = await animatedStandardMaterial(scene, "assets/sprites/character/character1_moving_left.png", "character-mat", 8, 1, 120);

    const animPlayer = new Animation("playerRotationAnimation", "rotationQuaternion", 60, Animation.ANIMATIONTYPE_QUATERNION, Animation.ANIMATIONLOOPMODE_CYCLE);
    const initialRotationQuaternion = new Vector3(-45, 0, 0).toQuaternion();
    const rotationQuaternionReversed = new Vector3(45, 135, 0).toQuaternion();

    const anim1 = [
        { frame: 0, value: initialRotationQuaternion }, { frame: 360, value: initialRotationQuaternion },
        { frame: 361, value: rotationQuaternionReversed }, { frame: 900, value: rotationQuaternionReversed },
        { frame: 901, value: initialRotationQuaternion }, { frame: 2500, value: initialRotationQuaternion },
        { frame: 2501, value: rotationQuaternionReversed }, { frame: 3200, value: rotationQuaternionReversed },
    ];

    animPlayer.setKeys(anim1);

    playerMesh.animations = [];
    playerMesh.animations.push(animPlayer);

    scene.beginAnimation(playerMesh, 0, 3400, true);

    parentMesh.animations = [];

    let animationsPosition = await Animation.ParseFromFileAsync("playerPositionAnimation", "assets/animations/main_menu_player_animation.json");
    (animationsPosition as Animation[]).forEach(animation => {
        parentMesh.animations.push(animation);
    });

    scene.beginDirectAnimation(parentMesh, parentMesh.animations, 0, 3400, true);

    return parentMesh;
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

    const soloBtn = await simpleButton('solo-btn', 'Solo', fontSizePercentage, 0.12, -((window.innerHeight / 20) * 6), Control.VERTICAL_ALIGNMENT_BOTTOM);
    soloBtn.onPointerClickObservable.add(() => {
        this.gotoSoloMenu();
    });
    guiMenu.addControl(soloBtn);

    const multiBtn = await simpleButton('multi-btn', 'Multiplayer', fontSizePercentage, 0.12, -((window.innerHeight / 20) * 3.5), Control.VERTICAL_ALIGNMENT_BOTTOM);
    multiBtn.onPointerClickObservable.add(() => {

    });
    guiMenu.addControl(multiBtn);

    const optionsBtn = await simpleButton('opt-btn', 'Options', fontSizePercentage, 0.12, -(window.innerHeight / 20), Control.VERTICAL_ALIGNMENT_BOTTOM);
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
    this.scene!.detachControl();
    this.engine.displayLoadingUI();

    const sceneToLoad = new Scene(this.engine);

    const playerParentMesh = await createTheAnimatedBGAndPlayerMesh(sceneToLoad);
    createCameraAndLight(sceneToLoad, playerParentMesh);

    await createGUI.call(this, sceneToLoad);

    await this.scene!.whenReadyAsync();

    sceneToLoad.attachControl();
    this.engine.hideLoadingUI();
    this.scene!.dispose();
    this.scene = sceneToLoad;
}