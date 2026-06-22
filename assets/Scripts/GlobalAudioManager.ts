import { _decorator, Component, AudioSource, Node, AudioClip } from 'cc';
import { AudioContent } from './AudioContent';
const { ccclass } = _decorator;

@ccclass('GlobalAudioManager')
export class GlobalAudioManager extends Component {
    private static _instance: GlobalAudioManager;
    private _audioSources: AudioSource[] = [];
    private _poolSize: number = 10; 

    public static get instance(): GlobalAudioManager {
        return this._instance;
    }

    onLoad() {
        if (GlobalAudioManager._instance) {
            this.destroy();
            return;
        }
        GlobalAudioManager._instance = this;

        for (let i = 0; i < this._poolSize; i++) {
            const audioSource = this.node.addComponent(AudioSource);
            audioSource.playOnAwake = false;
            this._audioSources.push(audioSource);
        }
    }

    public playOneShot(audioContent : AudioContent) {
        const source = this._audioSources.find(s => !s.playing);
        if (source) 
        {
            source.playOneShot(audioContent.AudioClip, audioContent.Volume * source.volume);
        } else {
            console.warn('No free AudioSource available in pool!');
        }
    }

    public play(audioContent : AudioContent)
    {
        const source = this._audioSources.find(s => !s.playing);
        if (source) {
            source.clip = audioContent.AudioClip;
            source.volume = Math.min(audioContent.Volume, source.volume);
            source.loop = audioContent.Loop;
            source.play();
        } else {
            console.warn('No free AudioSource available in pool!');
        }   
    }

    public playBGM(audioContent : AudioContent) {
        const bgm = this._audioSources[this._poolSize - 1];
        bgm.clip = audioContent.AudioClip;
        bgm.volume = Math.min(audioContent.Volume, bgm.volume);;
        bgm.loop = audioContent.Loop;
        if (!bgm.playing) {
            bgm.play();
        }
    }

    public stop(audioContent: AudioContent): void
    {
        if (!audioContent || !audioContent.AudioClip)
            return;

        const source = this._audioSources.find(s => 
            s && s.clip && s.clip.uuid === audioContent.AudioClip.uuid
        );

        if (source)
        {
            source.stop();
        }
    }

    public stopBGM() {
        const bgm = this._audioSources[0];
        if (bgm.playing) bgm.stop();
    }

    public getBGMPlayer()
    {
        return this._audioSources[0];
    }

    public setVolume(volume : number)
    {
        this._audioSources.forEach((audioSource) => 
        {
            audioSource.volume = volume;
        });
    }
}
