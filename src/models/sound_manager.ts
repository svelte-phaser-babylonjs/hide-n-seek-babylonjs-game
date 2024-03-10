import { AssetsManager, Sound, SoundTrack } from "babylonjs";

export default class {
    private assetsManager: AssetsManager;

    private ambientSoundTrack: SoundTrack;
    private musicSoundTrack: SoundTrack;
    private sfxSoundTrack: SoundTrack;

    private startAmbient!: Sound;
    private mainMenuMusic!: Sound;
    private gameMusic!: Sound;
    private confirmSound!: Sound;
    private backSound!: Sound;
    private pauseSound!: Sound;
    private resumeSound!: Sound;
    private collectSound!: Sound;
    private walkSound!: Sound;


    constructor() {
        this.assetsManager = new AssetsManager();

        this.ambientSoundTrack = new SoundTrack();
        this.musicSoundTrack = new SoundTrack();
        this.sfxSoundTrack = new SoundTrack();
    }

    public async loadSounds() {
        const startSoundTask = this.assetsManager.addBinaryFileTask("startAmbientTask", "assets/sounds/ambient/Forest_Ambience.mp3");
        startSoundTask.onSuccess = task => {
            this.startAmbient = new Sound("startAmbient", task.data, undefined, undefined, {
                autoplay: false,
                loop: true
            });
            this.ambientSoundTrack.addSound(this.startAmbient);
        }

        const mainMenuMusicTask = this.assetsManager.addBinaryFileTask("mainMenuMusicTask", "assets/sounds/musics/041415calmbgm.wav");
        mainMenuMusicTask.onSuccess = task => {
            this.mainMenuMusic = new Sound("mainMenuMusic", task.data, undefined, undefined, {
                autoplay: false,
                loop: true
            });
            this.musicSoundTrack.addSound(this.mainMenuMusic);
        }

        const gameMusicTask = this.assetsManager.addBinaryFileTask("gameMusicTask", "assets/sounds/musics/spring-day.mp3");
        gameMusicTask.onSuccess = task => {
            this.gameMusic = new Sound("gameMusic", task.data, undefined, undefined, {
                autoplay: false,
                loop: true
            });
            this.musicSoundTrack.addSound(this.gameMusic);
        }

        // SFX Sounds

        const confirmSoundTask = this.assetsManager.addBinaryFileTask("confirmSoundTask", "assets/sounds/sfx/Menu Soundpack 3.wav");
        confirmSoundTask.onSuccess = task => {
            this.confirmSound = new Sound("confirmSound", task.data, undefined, undefined, {
                autoplay: false,
                loop: false,
                length: 1,
                offset: 0,
            });
            this.sfxSoundTrack.addSound(this.confirmSound);
        }

        const backSoundTask = this.assetsManager.addBinaryFileTask("backSoundTask", "assets/sounds/sfx/029_Decline_09.wav");
        backSoundTask.onSuccess = task => {
            this.backSound = new Sound("backSound", task.data, undefined, undefined, {
                autoplay: false,
                loop: false
            });
            this.sfxSoundTrack.addSound(this.backSound);
        }

        const pauseSoundTask = this.assetsManager.addBinaryFileTask("pauseSoundTask", "assets/sounds/sfx/092_Pause_04.wav");
        pauseSoundTask.onSuccess = task => {
            this.pauseSound = new Sound("pauseSound", task.data, undefined, undefined, {
                autoplay: false,
                loop: false
            });
            this.sfxSoundTrack.addSound(this.pauseSound);
        }

        const resumeSoundTask = this.assetsManager.addBinaryFileTask("resumeSoundTask", "assets/sounds/sfx/098_Unpause_04.wav");
        resumeSoundTask.onSuccess = task => {
            this.resumeSound = new Sound("resumeSound", task.data, undefined, undefined, {
                autoplay: false,
                loop: false
            });
            this.sfxSoundTrack.addSound(this.resumeSound);
        }

        const collectSoundTask = this.assetsManager.addBinaryFileTask("collectSoundTask", "assets/sounds/sfx/coin.wav");
        collectSoundTask.onSuccess = task => {
            this.collectSound = new Sound("collectSound", task.data, undefined, undefined, {
                autoplay: false,
                loop: false
            });
            this.sfxSoundTrack.addSound(this.collectSound);
        }

        const walkSoundTask = this.assetsManager.addBinaryFileTask("walkSoundTask", "assets/sounds/sfx/sfx_step_grass_l.flac");
        walkSoundTask.onSuccess = task => {
            this.walkSound = new Sound("walkSound", task.data, undefined, undefined, {
                autoplay: false,
                loop: false
            });
            this.sfxSoundTrack.addSound(this.walkSound);
        }

        await this.assetsManager.loadAsync();
    }

    public playGameMusic() {
        this.startAmbient.stop();
        this.mainMenuMusic.stop();
        if (!this.gameMusic.isPlaying)
            this.gameMusic.play();
    }

    public stopGameMusic() {
        this.gameMusic.stop();
    }

    public playAmbientMusic() {
        this.gameMusic.stop();
        this.mainMenuMusic.stop();
        if (!this.startAmbient.isPlaying)
            this.startAmbient.play();
    }

    public stopAmbientMusic() {
        this.startAmbient.stop();
    }

    public playMainMenuMusic() {
        this.gameMusic.stop();
        this.startAmbient.stop();
        if (!this.mainMenuMusic.isPlaying)
            this.mainMenuMusic.play();
    }

    public stopMainMenuMusic() {
        this.mainMenuMusic.stop();
    }

    // SFX Sounds

    public playConfirmSound() {
        this.confirmSound.play();
    }

    public playBackSound() {
        this.backSound.play();
    }

    public playPauseSound() {
        this.pauseSound.play();
    }

    public playResumeSound() {
        this.resumeSound.play();
    }

    public playCollectSound() {
        this.collectSound.play();
    }

    public playWalkSound() {
        if (!this.walkSound.isPlaying) {
            this.walkSound.setPlaybackRate(Math.random() * (1.1 - 0.9) + 0.9);
            this.walkSound.setVolume(Math.random() * (1.1 - 0.9) + 0.9);
            this.walkSound.play();
        }
    }
}