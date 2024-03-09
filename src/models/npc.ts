import { ActionManager, Mesh, MeshBuilder, Scene, StandardMaterial, Vector3 } from "babylonjs";
import { animatedStandardMaterial } from "../helpers/sprite_generator";
import { AnimationsType, NPC_SPEED } from "../defs";
import { Entity } from ".";

export default class extends Entity {
    // Character movement components
    private position!: Vector3;
    private aiFunction!: number;

    private isAlreadyColliding = true;

    protected async init() {
        this.isAlreadyColliding = false;
        await this.setupAiGoals();

        this.scene.onBeforeRenderObservable.add(() => {
            if (this.isAlreadyColliding || !this.isReady) return;

            const player1 = this.scene.getMeshByName("player1-character1-mesh");
            const player2 = this.scene.getMeshByName("player2-character2-mesh");

            const intersct1 = player1 ? this.mesh.intersectsMesh(player1) : false;
            const intersct2 = player2 ? this.mesh.intersectsMesh(player2) : false;

            if (intersct1 && !this.isAlreadyColliding) {
                this.isAlreadyColliding = true;
                this.mesh.isVisible = false;

                if (this.state.destroyMesh) {
                    this.state.destroyMesh(this.mesh, 1);
                }

                this.state.score1 += 1;
            } else if (intersct2 && !this.isAlreadyColliding) {
                this.isAlreadyColliding = true;
                this.mesh.isVisible = false;

                if (this.state.destroyMesh) {
                    this.state.destroyMesh(this.mesh, 2);
                }

                this.state.score2 += 1;
            }
        });
    }

    private async setupAiGoals() {
        const behaviorGoal = Math.floor(Math.random() * 2);

        if (behaviorGoal) {
            const randomPosX = Math.random() * (16 - (-16)) + (-16);
            const randomPosY = Math.random() * (16 - (-16)) + (-16);

            this.position = new Vector3(randomPosX, randomPosY, 0);
        }

        this.aiFunction = setInterval(() => {
            const behaviorGoal = Math.floor(Math.random() * 2);

            if (behaviorGoal) {
                const randomPosX = Math.random() * (16 - (-16)) + (-16);
                const randomPosY = Math.random() * (16 - (-16)) + (-16);

                this.position = new Vector3(randomPosX, randomPosY, 0);
            }
        }, 7000)
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