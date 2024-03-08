import { AbstractMesh, DirectionalLight, FollowCamera, Mesh, MeshBuilder, Scene, Vector3 } from "babylonjs";
import { animatedStandardMaterial } from "../helpers/sprite_generator";
import { InputController } from ".";

const CHARACTER_SPEED: number = 12;

export default class {
    private scene: Scene;

    private input: InputController;

    private camera!: FollowCamera;
    private mesh!: Mesh;

    // Character movement components
    private direction: Vector3 = new Vector3();
    private inputAmt!: number;

    constructor(scene: Scene) {
        this.scene = scene;

        this.input = new InputController(scene);

        this.setupCharacterMesh();
        this.setupCharacterCamera();

        this.scene.registerBeforeRender(() => {
            this.updateFromControls();
        });
    }

    private async setupCharacterMesh() {
        this.mesh = MeshBuilder.CreatePlane("player-mesh", {
            width: 1,
            height: 1,
            sideOrientation: Mesh.DOUBLESIDE
        }, this.scene);

        this.mesh.position.z = -0.4;
        this.mesh.rotation.x = -45;

        this.mesh.material = await animatedStandardMaterial(
            this.scene,
            "assets/sprites/character/character1_watching.png",
            "character-mat",
            8,
            1,
            160
        );
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
            this.mesh.moveWithCollisions(this.direction);
        }
    }
}