import { _decorator, Component, AudioSource } from 'cc';
import { AudioContent } from './AudioContent';

const { ccclass, property } = _decorator;

@ccclass('GlobalAudioManager')
export class GlobalAudioManager extends Component {

    private static _instance: GlobalAudioManager;

    @property({ tooltip: 'Voices reserved for SFX. One extra source is added for BGM.' })
    private _poolSize: number = 16;

    private _sfx: AudioSource[] = [];
    private _bgm: AudioSource = null!;
    private _masterVolume: number = 1;

    public static get instance(): GlobalAudioManager { return this._instance; }

    onLoad() {
        if (GlobalAudioManager._instance) { this.destroy(); return; }
        GlobalAudioManager._instance = this;

        for (let i = 0; i < this._poolSize; i++) {
            const s = this.node.addComponent(AudioSource);
            s.playOnAwake = false;
            this._sfx.push(s);
        }
        this._bgm = this.node.addComponent(AudioSource);
        this._bgm.playOnAwake = false;
    }

    /** Falls back to the oldest voice rather than dropping the sound. */
    private freeSource(): AudioSource {
        return this._sfx.find(s => !s.playing) ?? this._sfx[0];
    }

    public playOneShot(audioContent: AudioContent) {
        if (!audioContent?.AudioClip) return;
        this.freeSource().playOneShot(audioContent.AudioClip, audioContent.Volume * this._masterVolume);
    }

    public play(audioContent: AudioContent) {
        if (!audioContent?.AudioClip) return;
        const s = this.freeSource();
        s.clip = audioContent.AudioClip;
        s.volume = audioContent.Volume * this._masterVolume;
        s.loop = audioContent.Loop;
        s.play();
    }

    public playBGM(audioContent: AudioContent) {
        if (!audioContent?.AudioClip) return;
        this._bgm.clip = audioContent.AudioClip;
        this._bgm.volume = audioContent.Volume * this._masterVolume;
        this._bgm.loop = audioContent.Loop;
        if (!this._bgm.playing) this._bgm.play();
    }

    public stop(audioContent: AudioContent) {
        if (!audioContent?.AudioClip) return;
        const s = this._sfx.find(x => x.clip && x.clip.uuid === audioContent.AudioClip.uuid);
        s?.stop();
    }

    public stopBGM() { if (this._bgm.playing) this._bgm.stop(); }

    public getBGMPlayer(): AudioSource { return this._bgm; }

    public setVolume(volume: number) {
        this._masterVolume = volume;
        this._sfx.forEach(s => { s.volume = volume; });
        this._bgm.volume = volume;
    }
}