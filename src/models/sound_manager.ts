import { AssetsManager, Sound, SoundTrack } from "babylonjs";

export default class {
    private assetsManager: AssetsManager;

    private ambientSoundTrack: SoundTrack;
    private musicSoundTrack: SoundTrack;
    private sfxSoundTrack: SoundTrack;

    private startAmbient!: Sound;
    private mainMenuMusic!: Sound;
    private gameMusic!: Sound;

    constructor() {
        this.assetsManager = new AssetsManager();

        this.ambientSoundTrack = new SoundTrack();
        this.musicSoundTrack = new SoundTrack();
        this.sfxSoundTrack = new SoundTrack();
    }

    public async loadSounds() {
        const taskStart = this.assetsManager.addBinaryFileTask("startAmbientTask", "assets/sounds/ambient/Forest_Ambience.mp3");
        taskStart.onSuccess = task => {
            this.startAmbient = new Sound("startAmbient", task.data, undefined, undefined, {
                autoplay: false,
                loop: true
            });
            this.ambientSoundTrack.addSound(this.startAmbient);
        }

        const taskMainMenu = this.assetsManager.addBinaryFileTask("mainMenuMusicTaska", "assets/sounds/musics/041415calmbgm.wav");
        taskMainMenu.onSuccess = task => {
            this.mainMenuMusic = new Sound("mainMenuMusic", task.data, undefined, undefined, {
                autoplay: false,
                loop: true
            });
            this.musicSoundTrack.addSound(this.mainMenuMusic);
        }

        const taskGameMusic = this.assetsManager.addBinaryFileTask("gameMusicTask", "assets/sounds/musics/spring-day.mp3");
        taskGameMusic.onSuccess = task => {
            this.gameMusic = new Sound("gameMusic", task.data, undefined, undefined, {
                autoplay: false,
                loop: true
            });
            this.musicSoundTrack.addSound(this.gameMusic);
        }
        await this.assetsManager.loadAsync();
    }

    public playGameMusic() {
        this.gameMusic.play();
    }

    public playAmbientMusic() {
        this.startAmbient.play();
    }

    public playMainMenuMusic() {
        this.mainMenuMusic.play();
    }

    public stopGameMusic() {
        this.gameMusic.stop();
    }

    public stopAmbientMusic() {
        this.startAmbient.stop();
    }

    public stopMainMenuMusic() {
        this.mainMenuMusic.stop();
    }
}