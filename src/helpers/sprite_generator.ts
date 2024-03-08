import { AssetsManager, Engine, Scene, Sprite, SpriteManager, SpriteMap, SpritePackedManager, Texture, Vector2, Vector3 } from "babylonjs";

export async function spriteRandomGenerator(
    scene: Scene,
    name: string,
    spriteUrl: string,
    width: number,
    height: number,
    qty: number,
    min: number,
    max: number,
    zPos: number,
    spriteWidth: number,
    spriteHeight: number,
    isAnimated = false as boolean,
    numberOfFrames?: number
): Promise<void> {
    const spriteManager = new SpriteManager(
        `${name}Manager`,
        spriteUrl,
        100,
        { width: width, height: height },
        scene
    );

    for (let i = 0; i < qty; ++i) {
        const randomPosX = Math.random() * (max - min) + min;
        const randomPosY = Math.random() * (max - min) + min;

        const sprite = new Sprite(`${name}-${i}`, spriteManager);

        sprite.width = spriteWidth;
        sprite.height = spriteHeight;

        sprite.position = new Vector3(randomPosX, randomPosY, zPos);

        if (isAnimated) {
            sprite.playAnimation(0, numberOfFrames!, true, 150);
        }
    }
}

export async function spritePackRandomGenerator(
    spritePack: SpritePackedManager,
    name: string,
    spriteCellRef: string,
    qty: number,
    min: number,
    max: number,
    zPos: number,
    spriteWidth: number,
    spriteHeight: number
): Promise<void> {
    for (let i = 1; i < qty; ++i) {
        const randomPosX = Math.random() * (max - min) + min;
        const randomPosY = Math.random() * (max - min) + min;

        const sprite = new Sprite(`${name}-${i}`, spritePack);

        sprite.cellRef = spriteCellRef;

        sprite.width = spriteWidth;
        sprite.height = spriteHeight;
        sprite.position = new Vector3(randomPosX, randomPosY, zPos);
    }
}

export async function spriteMapGenerator(
    scene: Scene,
    textureUrl: string,
    titleMapJsonUrl: string,
    titleMapFileUrl: string,
    bgSize: Vector2,
    outputSize: Vector2
) {
    const spriteSheet = new Texture(textureUrl, scene, false, false, Texture.NEAREST_NEAREST, null, null, null, false, Engine.TEXTUREFORMAT_RGBA);

    const assetsManager = new AssetsManager(scene);

    assetsManager.autoHideLoadingUI = true;

    const textTask = assetsManager.addTextFileTask("taskBackground", titleMapJsonUrl);

    textTask.onSuccess = task => {
        let atlasJson = JSON.parse(task.text);

        let spriteMap = new SpriteMap('sprite-map', atlasJson, spriteSheet, {
            stageSize: bgSize,
            outputSize,
            outputPosition: Vector3.Zero(),
            outputRotation: Vector3.Zero(),
            baseTile: 0,
            flipU: true
        }, scene);

        spriteMap.loadTileMaps(titleMapFileUrl);
    }

    assetsManager.loadAsync();
}