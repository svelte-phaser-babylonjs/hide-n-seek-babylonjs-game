import { Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { AnimationsType, GameState } from "../defs";

export default abstract class {
    protected scene: Scene;
    protected mesh!: Mesh;
    protected state: GameState;
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

    protected isReady: boolean;

    constructor(scene: Scene, state: GameState, name: string, type: string, defaultPosX: number, defaultPosY: number) {
        this.scene = scene;
        this.state = state;
        this.name = name;
        this.type = type;

        this.isReady = false;

        this.configCharacter(defaultPosX, defaultPosY).then(async () => {
            await this.init();

            setTimeout(() => this.isReady = true, 2000);

            this.scene.registerBeforeRender(() => {
                if (state.isPaused) return;

                this.updatePosition();
                this.updateAnimations();
            });
        });

    }

    protected abstract init(): Promise<void>;

    protected abstract setupAnimations(): Promise<void>;

    protected async configCharacter(defaultPosX: number, defaultPosY: number): Promise<void> {
        await this.setupMesh(defaultPosX, defaultPosY);
        await this.setupAnimations();
    }

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
