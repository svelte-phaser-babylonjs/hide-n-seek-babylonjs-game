import { Scene, Vector2 } from "babylonjs";
import { spriteMapGenerator } from "../helpers/sprite_generator";

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
    }
}