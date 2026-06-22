System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, AudioSource, _dec, _class, _class2, _crd, ccclass, GlobalAudioManager;

  function _reportPossibleCrUseOfAudioContent(extras) {
    _reporterNs.report("AudioContent", "./AudioContent", _context.meta, extras);
  }

  return {
    setters: [function (_unresolved_) {
      _reporterNs = _unresolved_;
    }, function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      AudioSource = _cc.AudioSource;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "2ba60oV3vlNsoqZei6zy80e", "GlobalAudioManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'AudioSource', 'Node', 'AudioClip']);

      ({
        ccclass
      } = _decorator);

      _export("GlobalAudioManager", GlobalAudioManager = (_dec = ccclass('GlobalAudioManager'), _dec(_class = (_class2 = class GlobalAudioManager extends Component {
        constructor() {
          super(...arguments);
          this._audioSources = [];
          this._poolSize = 10;
        }

        static get instance() {
          return this._instance;
        }

        onLoad() {
          if (GlobalAudioManager._instance) {
            this.destroy();
            return;
          }

          GlobalAudioManager._instance = this;

          for (var i = 0; i < this._poolSize; i++) {
            var audioSource = this.node.addComponent(AudioSource);
            audioSource.playOnAwake = false;

            this._audioSources.push(audioSource);
          }
        }

        playOneShot(audioContent) {
          var source = this._audioSources.find(s => !s.playing);

          if (source) {
            source.playOneShot(audioContent.AudioClip, audioContent.Volume * source.volume);
          } else {
            console.warn('No free AudioSource available in pool!');
          }
        }

        play(audioContent) {
          var source = this._audioSources.find(s => !s.playing);

          if (source) {
            source.clip = audioContent.AudioClip;
            source.volume = Math.min(audioContent.Volume, source.volume);
            source.loop = audioContent.Loop;
            source.play();
          } else {
            console.warn('No free AudioSource available in pool!');
          }
        }

        playBGM(audioContent) {
          var bgm = this._audioSources[this._poolSize - 1];
          bgm.clip = audioContent.AudioClip;
          bgm.volume = Math.min(audioContent.Volume, bgm.volume);
          ;
          bgm.loop = audioContent.Loop;

          if (!bgm.playing) {
            bgm.play();
          }
        }

        stop(audioContent) {
          if (!audioContent || !audioContent.AudioClip) return;

          var source = this._audioSources.find(s => s && s.clip && s.clip.uuid === audioContent.AudioClip.uuid);

          if (source) {
            source.stop();
          }
        }

        stopBGM() {
          var bgm = this._audioSources[0];
          if (bgm.playing) bgm.stop();
        }

        getBGMPlayer() {
          return this._audioSources[0];
        }

        setVolume(volume) {
          this._audioSources.forEach(audioSource => {
            audioSource.volume = volume;
          });
        }

      }, _class2._instance = void 0, _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1b7e8310db8f72c608fbb67abaffe76c04e988c2.js.map