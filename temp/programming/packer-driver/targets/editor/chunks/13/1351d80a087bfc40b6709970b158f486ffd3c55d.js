System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, CCString, director, input, Input, GlobalAudioManager, AudioContent, AdManager, EndCard, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _crd, ccclass, property, GameManager;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfGlobalAudioManager(extras) {
    _reporterNs.report("GlobalAudioManager", "./GlobalAudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioContent(extras) {
    _reporterNs.report("AudioContent", "./AudioContent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAdManager(extras) {
    _reporterNs.report("AdManager", "./AdManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEndCard(extras) {
    _reporterNs.report("EndCard", "./EndCard", _context.meta, extras);
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
      Node = _cc.Node;
      CCString = _cc.CCString;
      director = _cc.director;
      input = _cc.input;
      Input = _cc.Input;
    }, function (_unresolved_2) {
      GlobalAudioManager = _unresolved_2.GlobalAudioManager;
    }, function (_unresolved_3) {
      AudioContent = _unresolved_3.AudioContent;
    }, function (_unresolved_4) {
      AdManager = _unresolved_4.AdManager;
    }, function (_unresolved_5) {
      EndCard = _unresolved_5.EndCard;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "1a622CSydNKd5rVl1uUwxrO", "GameManager", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'CCString', 'director', 'input', 'Input', 'EventTouch']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("GameManager", GameManager = (_dec = ccclass('GameManager'), _dec2 = property({
        type: CCString
      }), _dec3 = property({
        type: CCString
      }), _dec4 = property(Node), _dec5 = property(_crd && EndCard === void 0 ? (_reportPossibleCrUseOfEndCard({
        error: Error()
      }), EndCard) : EndCard), _dec(_class = (_class2 = class GameManager extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "IosLink", _descriptor, this);

          _initializerDefineProperty(this, "PlayStoreLink", _descriptor2, this);

          _initializerDefineProperty(this, "BGM", _descriptor3, this);

          _initializerDefineProperty(this, "RedirectDelay", _descriptor4, this);

          _initializerDefineProperty(this, "EndCardComp", _descriptor5, this);

          this.onTap = _e => {
            input.off(Input.EventType.TOUCH_START, this.onTap, this);
            this.Redirect();
          };
        }

        onLoad() {
          // Optional fallback: any system can director.emit('GameComplete')
          // to arm a "tap anywhere → store" redirect after RedirectDelay.
          director.on('GameComplete', this.onGameComplete, this);
        }

        start() {
          (_crd && AdManager === void 0 ? (_reportPossibleCrUseOfAdManager({
            error: Error()
          }), AdManager) : AdManager).gameReady();

          if (this.BGM && (_crd && GlobalAudioManager === void 0 ? (_reportPossibleCrUseOfGlobalAudioManager({
            error: Error()
          }), GlobalAudioManager) : GlobalAudioManager).instance) {
            (_crd && GlobalAudioManager === void 0 ? (_reportPossibleCrUseOfGlobalAudioManager({
              error: Error()
            }), GlobalAudioManager) : GlobalAudioManager).instance.playBGM(this.BGM.getComponent(_crd && AudioContent === void 0 ? (_reportPossibleCrUseOfAudioContent({
              error: Error()
            }), AudioContent) : AudioContent));
          }
        }

        onDestroy() {
          director.off('GameComplete', this.onGameComplete, this);
          input.off(Input.EventType.TOUCH_START, this.onTap, this);
        }
        /**
         * Call when the round ends. Notifies the ad network and shows the end card
         * in its win or lose variant; tapping it redirects to the store.
         */


        showEndCard(won) {
          (_crd && AdManager === void 0 ? (_reportPossibleCrUseOfAdManager({
            error: Error()
          }), AdManager) : AdManager).gameEnd();
          this.EndCardComp.show(won, () => this.Redirect());
        }

        onGameComplete() {
          this.scheduleOnce(() => {
            input.on(Input.EventType.TOUCH_START, this.onTap, this);
          }, this.RedirectDelay);
        }

        Redirect() {
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.userAgent.includes('Macintosh');
          (_crd && AdManager === void 0 ? (_reportPossibleCrUseOfAdManager({
            error: Error()
          }), AdManager) : AdManager).openStore(isIOS ? this.IosLink : this.PlayStoreLink);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "IosLink", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "PlayStoreLink", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return '';
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "BGM", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "RedirectDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "EndCardComp", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=1351d80a087bfc40b6709970b158f486ffd3c55d.js.map