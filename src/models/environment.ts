import { Color3, Color4, CubeTexture, MeshBuilder, ParticleSystem, Scene, StandardMaterial, Texture, Vector2, Vector3 } from "babylonjs";
import { spriteMapGenerator, spriteMeshGenerator } from "../helpers/sprite_generator";
import { Npc } from ".";
import { GameState } from "../defs";

export default class {
    private scene: Scene;

    constructor(scene: Scene, state: GameState) {
        this.scene = scene;

        this.initMap(state);
    }

    private async initMap(state: GameState) {
        spriteMapGenerator(
            this.scene,
            "assets/textures/tile_map_texture.png",
            "assets/tilemaps/tile_map_texture.json",
            "assets/tilemaps/menu_tile_map.tilemaps",
            new Vector2(4, 4),
            new Vector2(40, 40)
        );

        const material1 = new StandardMaterial('tree-round', this.scene);
        const texture1 = new Texture("assets/textures/environment/tree_round.png", this.scene);
        await spriteMeshGenerator(this.scene, texture1, material1, "tree-round-mesh", -16, 16, -2.5, 7, 8, 10);

        const material2 = new StandardMaterial('tree-triangle', this.scene);
        const texture2 = new Texture("assets/textures/environment/tree_triangle.png", this.scene);
        await spriteMeshGenerator(this.scene, texture2, material2, "tree-triangle-mesh", -16, 16, -1.5, 2, 4, 10);

        const material3 = new StandardMaterial('grass', this.scene);
        const texture3 = new Texture("assets/textures/environment/grass.png", this.scene);
        await spriteMeshGenerator(this.scene, texture3, material3, "grass-mesh", -16, 16, -0.2, 1, 1, 10);

        const material4 = new StandardMaterial('rock', this.scene);
        const texture4 = new Texture("assets/textures/environment/rock.png", this.scene);
        await spriteMeshGenerator(this.scene, texture4, material4, "rock-mesh", -16, 16, -0.1, 0.5, 0.5, 5);

        const material5 = new StandardMaterial('statue', this.scene);
        const texture5 = new Texture("assets/textures/environment/statue.png", this.scene);
        await spriteMeshGenerator(this.scene, texture5, material5, "statue-mesh", -16, 16, -0.4, 1, 1, 5);


        // NPCs
        for (let i = 0; i < 10; ++i) {
            const randomPosX = (Math.random() * 32) - 16;
            const randomPosY = (Math.random() * 32) - 16;

            new Npc(this.scene, state, `npc-${i}`, "rabbit", randomPosX, randomPosY);
        }

        const skybox = MeshBuilder.CreateBox("skybox", { size: 100 }, this.scene);
        const skyboxMat = new StandardMaterial("skybox-mat", this.scene);
        skyboxMat.backFaceCulling = false;
        skyboxMat.reflectionTexture = new CubeTexture("assets/textures/skybox/skybox_water", this.scene);
        skyboxMat.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
        skyboxMat.diffuseColor = new Color3(0, 0, 0);
        skyboxMat.specularColor = new Color3(0, 0, 0);
        skyboxMat.disableLighting = true;

        skybox.material = skyboxMat;

        await this.fog();
    }

    private async fog() {
        let particleSystem = new ParticleSystem("particle-sys", 500, this.scene);
        const emitterParticles = MeshBuilder.CreateBox("emitter-particles", { size: 0.01 }, this.scene);

        emitterParticles.position.z = -1;
        emitterParticles.rotationQuaternion = new Vector3(Math.PI / 2, 0, 0).toQuaternion();
        emitterParticles.visibility = 0;

        particleSystem.manualEmitCount = particleSystem.getCapacity();
        particleSystem.minEmitBox = new Vector3(-16, 2, -16);
        particleSystem.maxEmitBox = new Vector3(16, 2, 16);

        particleSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.85);
        particleSystem.color2 = new Color4(0.95, 0.95, 0.95, 0.95);
        particleSystem.colorDead = new Color4(0.9, 0.9, 0.9, 0.6);

        particleSystem.minSize = 3.5;
        particleSystem.maxSize = 5;
        particleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;

        particleSystem.emitRate = 50000;

        particleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;

        particleSystem.gravity = Vector3.Zero();
        particleSystem.direction1 = Vector3.Zero();
        particleSystem.direction2 = Vector3.Zero();

        particleSystem.minAngularSpeed = -2;
        particleSystem.maxAngularSpeed = 2;

        particleSystem.minEmitPower = 0.5;
        particleSystem.maxEmitPower = 1;

        particleSystem.updateSpeed = 0.005;

        particleSystem.emitter = emitterParticles;
        particleSystem.renderingGroupId = 1;
        const fogTexture = new Texture("assets/textures/smoke.png", this.scene);
        particleSystem.particleTexture = fogTexture.clone();

        particleSystem.start();
    }
}