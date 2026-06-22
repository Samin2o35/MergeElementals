System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, AudioClip, CCFloat, Component, EventHandler, _dec, _dec2, _dec3, _dec4, _dec5, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _crd, ccclass, property, AudioContent;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      AudioClip = _cc.AudioClip;
      CCFloat = _cc.CCFloat;
      Component = _cc.Component;
      EventHandler = _cc.EventHandler;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "46be3K84iBGRJa1iVjNU959", "AudioContent", undefined);

      __checkObsolete__(['_decorator', 'AudioClip', 'AudioSource', 'CCFloat', 'Component', 'EventHandler', 'Node']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("AudioContent", AudioContent = (_dec = ccclass('AudioContent'), _dec2 = property(AudioClip), _dec3 = property({
        type: CCFloat,
        range: [0, 1]
      }), _dec4 = property(EventHandler), _dec5 = property(EventHandler), _dec(_class = (_class2 = class AudioContent extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "AudioName", _descriptor, this);

          _initializerDefineProperty(this, "AudioClip", _descriptor2, this);

          _initializerDefineProperty(this, "Loop", _descriptor3, this);

          _initializerDefineProperty(this, "Volume", _descriptor4, this);

          _initializerDefineProperty(this, "PlayOnLoad", _descriptor5, this);

          _initializerDefineProperty(this, "OnPlayingStart", _descriptor6, this);

          _initializerDefineProperty(this, "OnPlayingEnd", _descriptor7, this);

          this.AudioSource = null;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "AudioName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return "";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "AudioClip", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "Loop", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "Volume", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 1.0;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "PlayOnLoad", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "OnPlayingStart", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new EventHandler();
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "OnPlayingEnd", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return new EventHandler();
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=14c7749f58f6c3e65c8e816b54c5077fd49966aa.js.map