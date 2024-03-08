import { Scene, Sprite, SpriteManager, Vector3 } from "babylonjs";

export async function spriteManagerGenerator(
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