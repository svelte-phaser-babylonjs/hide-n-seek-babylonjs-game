import { Mesh, StandardMaterial } from "babylonjs";

export const CHARACTER_SPEED: number = 9;
export const NPC_SPEED: number = 12;
export const CATCH_FEEDBACK_SPEED: number = 50;
export const FONT_SIZE_PERCENTAGE = 0.06;

export type AnimationsType = {
    watching: StandardMaterial | null,
    moving_left: StandardMaterial | null,
    moving_right: StandardMaterial | null,
    moving_up: StandardMaterial | null,
    moving_down: StandardMaterial | null,
};

export type GameState = {
    isPaused: boolean;
    isExited: boolean;
    score1: number;
    score2: number;
    winScore: number;
    destroyMesh: ((mesh: Mesh) => void) | null;

    isGameOver: boolean;
    isTwoPlayer: boolean;
}
