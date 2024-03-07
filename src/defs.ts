import { Scene } from "babylonjs";

export enum State {
    START,
    MAIN_MENU,
    SOLO_MENU,
    MULTI_MENU,
    OPTIONS,
    GAME_SOLO,
    GAME_MULTI,
    LOSE,
    WIN,
};

export type Status = {
    scene: Scene | null,
    state: State,
};