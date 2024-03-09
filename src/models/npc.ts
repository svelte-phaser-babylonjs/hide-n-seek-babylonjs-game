import { Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { animatedStandardMaterial } from "../helpers/sprite_generator";
import { NPC_SPEED } from "../defs";
import { Entity } from ".";

type AnimationsType = {
    watching: StandardMaterial | null,
    moving_left: StandardMaterial | null,
    moving_right: StandardMaterial | null,
    moving_up: StandardMaterial | null,
    moving_down: StandardMaterial | null,
};

export default class NpcController extends Entity {
    // Character movement components
    private position!: Vector3;
    private aiFunction!: number;

    protected init(): void {
        this.setupAiGoals();
    }

    private async setupAiGoals() {
        this.aiFunction = setInterval(() => {
            const behaviorGoal = Math.floor(Math.random() * 2);

            if (behaviorGoal) {
                const randomPosX = Math.random() * (16 - (-16)) + (-16);
                const randomPosY = Math.random() * (16 - (-16)) + (-16);

                this.position = new Vector3(randomPosX, randomPosY, 0);
            }
        }, 3000)
    }

    protected async setupAnimations(): Promise<void> {
        for (const key of Object.keys(this.animations)) {
            this.animations[key as keyof AnimationsType] = await animatedStandardMaterial(
                this.scene,
                `assets/sprites/animals/${this.type}_${key}.png`,
                `${this.name}-${this.type}-${key}-mat`,
                key === 'watching' ? 6 : 4,
                key === 'watching' ? 2 : 1,
                key === 'watching' ? 190 : 150,
            );
        }
    }

    protected updatePosition(): void {
        if (!this.position || !this.scene || !this.mesh) return;

        const dt = this.scene ? this.scene.getEngine().getDeltaTime() / 1000 : 0;

        const rawDirection = this.position.subtract(this.mesh.position);
        const distance = rawDirection.length();

        if (distance > 1) {
            this.direction = rawDirection.normalize().scaleInPlace(NPC_SPEED * dt);
            this.mesh.moveWithCollisions(this.direction);
        } else {
            this.direction = Vector3.Zero();
        }
    }
}