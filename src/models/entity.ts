import { Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { animatedStandardMaterial } from "../helpers/sprite_generator";

type AnimationsType = {
    watching: StandardMaterial | null,
    moving_left: StandardMaterial | null,
    moving_right: StandardMaterial | null,
    moving_up: StandardMaterial | null,
    moving_down: StandardMaterial | null,
};

export default abstract class {
    protected scene: Scene;
    protected mesh!: Mesh;
    protected name: string;
    protected type: string;
    protected direction: Vector3 = new Vector3();
    protected animations: AnimationsType = {
        watching: null,
        moving_left: null,
        moving_right: null,
        moving_up: null,
        moving_down: null,
    };

    constructor(scene: Scene, name: string, type: string, defaultPosX: number, defaultPosY: number) {
        this.scene = scene;
        this.name = name;
        this.type = type;

        this.setupAnimations();
        this.setupMesh(defaultPosX, defaultPosY);

        this.init();

        this.scene.registerBeforeRender(() => {
            this.updatePosition();
            this.updateAnimations();
        });
    }

    protected abstract init(): void;

    protected abstract setupAnimations(): Promise<void>;

    protected async setupMesh(defaultPosX: number, defaultPosY: number) {
        this.mesh = MeshBuilder.CreatePlane(`${this.name}-${this.type}-mesh`, {
            width: 1,
            height: 1,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);

        this.mesh.position.x = defaultPosX;
        this.mesh.position.y = defaultPosY;
        this.mesh.position.z = -0.4;
        this.mesh.rotation.x = -45;

        this.mesh.material = this.animations.watching;
    }

    protected abstract updatePosition(): void;

    protected updateAnimations() {
        if (this.direction.x === 0 && this.direction.y === 0) {
            this.mesh.material = this.animations.watching;
        }
        else if (this.direction.y > 0) {
            this.mesh.material = this.animations.moving_up;
        }
        else if (this.direction.y < 0) {
            this.mesh.material = this.animations.moving_down;
        }
        else if (this.direction.x > 0) {
            this.mesh.material = this.animations.moving_right;
        }
        else if (this.direction.x < 0) {
            this.mesh.material = this.animations.moving_left;
        }
    }
}
