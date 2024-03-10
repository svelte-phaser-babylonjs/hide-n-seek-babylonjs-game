import { DirectionalLight, FollowCamera, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3, Viewport } from "babylonjs";
import { animatedStandardMaterial } from "../helpers/sprite_generator";
import { CHARACTER_SPEED, GameState } from "../defs";
import { Entity, InputController } from ".";

type AnimationsType = {
    watching: StandardMaterial | null,
    moving_left: StandardMaterial | null,
    moving_right: StandardMaterial | null,
    moving_up: StandardMaterial | null,
    moving_down: StandardMaterial | null,
};

export default class extends Entity {
    private input!: InputController;

    private camera!: FollowCamera;

    // Character movement components
    private inputAmt!: number;
    private playerNumber: number;

    constructor(scene: Scene, state: GameState, playerNumber: number, defaultPosX: number, defaultPosY: number) {
        super(scene, state, `player${playerNumber}`, `character${playerNumber}`, defaultPosX, defaultPosY);

        this.playerNumber = playerNumber;
    }

    private async setupCamera() {
        const light = new DirectionalLight("light", new Vector3(0, 1, 1), this.scene);
        light.intensity = 0.4;

        this.camera = new FollowCamera('follow-camera', new Vector3(0, -3, -10), this.scene);

        this.camera.radius = -3.5;
        this.camera.heightOffset = -3.5;
        this.camera.rotation.x = -45;
        this.camera.cameraAcceleration = 0.1;
        this.camera.noRotationConstraint = true;
        this.camera.maxCameraSpeed = 1;
        this.camera.lockedTarget = this.mesh;

        if (this.state.isTwoPlayer) {
            this.camera.viewport = new Viewport(this.playerNumber === 1 ? 0 : 0.5, 0, 0.5, 1);
            this.camera.layerMask = this.playerNumber;
            this.scene.activeCameras?.unshift(this.camera);
        }
    }

    protected init() {
        this.setupCamera();
    }

    protected override async setupAnimations(): Promise<void> {
        for (const key of Object.keys(this.animations)) {
            this.animations[key as keyof AnimationsType] = await animatedStandardMaterial(
                this.scene,
                `assets/sprites/character/${this.type}_${key}.png`,
                `${this.name}-${this.type}-${key}-mat`,
                8,
                1,
                key === 'watching' ? 190 : 55,
            );
        }
    }

    protected override async updatePosition() {
        if (!this.scene || !this.mesh || !this.playerNumber) return;

        if (!this.input) {
            await this.scene.whenReadyAsync();
            this.input = new InputController(this.scene, this.state, this.playerNumber);
        }

        const dt = this.scene.getEngine().getDeltaTime() / 1000;
        this.direction = Vector3.Zero();

        const horizontal = this.input.horizontal;
        const vertical = this.input.vertical;

        let move = new Vector3(horizontal, vertical, 0);
        this.direction = new Vector3(move.normalize().x, move.normalize().y, 0);

        let inputMag = Math.abs(horizontal) + Math.abs(vertical);
        if (inputMag < 0) {
            this.inputAmt = 0;
        } else if (inputMag > 1) {
            this.inputAmt = 1;
        } else {
            this.inputAmt = inputMag;
        }

        this.direction = this.direction.scaleInPlace(this.inputAmt * CHARACTER_SPEED * dt);

        const limitedDirection = new Vector3(
            (this.mesh.position.x > 16 && this.direction.x > 0) || (this.mesh.position.x < -16 && this.direction.x < 0) ? 0 : this.direction.x,
            (this.mesh.position.y > 16 && this.direction.y > 0) || (this.mesh.position.y < -16 && this.direction.y < 0) ? 0 : this.direction.y
        );
        this.mesh.moveWithCollisions(limitedDirection);
    }
}