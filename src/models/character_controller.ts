import { DirectionalLight, FollowCamera, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { animatedStandardMaterial } from "../helpers/sprite_generator";
import { InputController } from ".";

const CHARACTER_SPEED: number = 9;

type CharacterAnimations = {
    watching: StandardMaterial | null,
    moving_left: StandardMaterial | null,
    moving_right: StandardMaterial | null,
    moving_up: StandardMaterial | null,
    moving_down: StandardMaterial | null,
};

export default class {
    private scene: Scene;

    private input: InputController;

    private camera!: FollowCamera;
    private mesh!: Mesh;

    // Character movement components
    private direction: Vector3 = new Vector3();
    private inputAmt!: number;

    // Character animation components
    private animations: CharacterAnimations = {
        watching: null,
        moving_left: null,
        moving_right: null,
        moving_up: null,
        moving_down: null,
    };

    constructor(scene: Scene) {
        this.scene = scene;

        this.input = new InputController(scene);

        this.setupCharacterAnimations();
        this.setupCharacterMesh();
        this.setupCharacterCamera();

        this.scene.registerBeforeRender(() => {
            this.updateFromControls();
            this.updateCharacterAnimations();
        });
    }

    private async setupCharacterAnimations() {
        for (const key of Object.keys(this.animations)) {
            this.animations[key as keyof CharacterAnimations] = await animatedStandardMaterial(
                this.scene,
                `assets/sprites/character/character1_${key}.png`,
                `character1-${key}-mat`,
                8,
                1,
                55
            );
        }
    }

    private async setupCharacterMesh() {
        this.mesh = MeshBuilder.CreatePlane("player-mesh", {
            width: 1,
            height: 1,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);

        this.mesh.position.z = -0.4;
        this.mesh.rotation.x = -45;

        this.mesh.material = this.animations.watching;
    }

    private async setupCharacterCamera() {
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
    }

    private updateFromControls() {
        const dt = this.scene ? this.scene.getEngine().getDeltaTime() / 1000 : 0;
        this.direction = Vector3.Zero();

        const horizontal = this.input ? this.input.horizontal : 0;
        const vertical = this.input ? this.input.vertical : 0;

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

        if (this.mesh) {
            const limitedDirection = new Vector3(
                (this.mesh.position.x > 16 && this.direction.x > 0) || (this.mesh.position.x < -16 && this.direction.x < 0) ? 0 : this.direction.x,
                (this.mesh.position.y > 16 && this.direction.y > 0) || (this.mesh.position.y < -16 && this.direction.y < 0) ? 0 : this.direction.y
            );
            this.mesh.moveWithCollisions(limitedDirection);
        }
    }

    private updateCharacterAnimations() {
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