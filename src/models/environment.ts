import { Scene, StandardMaterial, Texture, Vector2 } from "babylonjs";
import { spriteMapGenerator, spriteMeshGenerator } from "../helpers/sprite_generator";

export default class {
    private scene: Scene;

    constructor(scene: Scene) {
        this.scene = scene;

        this.initMap();
    }

    private async initMap() {
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
    }
}