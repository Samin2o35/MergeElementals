System.register(["__unresolved_0", "cc", "__unresolved_1"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, CCString, Input, tween, Vec3, AdManager, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _crd, ccclass, property, ClickRedirect;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfAdManager(extras) {
    _reporterNs.report("AdManager", "./AdManager", _context.meta, extras);
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
      CCString = _cc.CCString;
      Input = _cc.Input;
      tween = _cc.tween;
      Vec3 = _cc.Vec3;
    }, function (_unresolved_2) {
      AdManager = _unresolved_2.AdManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "7496fsAo0lA/IynSRJr/nED", "ClickRedirect", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'CCString', 'Input', 'EventTouch', 'tween', 'Vec3']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ClickRedirect", ClickRedirect = (_dec = ccclass('ClickRedirect'), _dec2 = property(CCString), _dec3 = property(CCString), _dec(_class = (_class2 = class ClickRedirect extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "IosLink", _descriptor, this);

          _initializerDefineProperty(this, "PlayStoreLink", _descriptor2, this);

          this.originalScale = new Vec3();
        }

        start() {
          // Store the original scale
          this.originalScale = this.node.scale.clone(); // Make the node clickable by listening to touch events

          this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.on(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onDestroy() {
          // Clean up event listeners
          this.node.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          this.node.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          this.node.off(Input.EventType.TOUCH_CANCEL, this.onTouchCancel, this);
        }

        onTouchStart(event) {
          // Scale down effect when pressed
          tween(this.node).to(0.1, {
            scale: this.originalScale.clone().multiplyScalar(0.9)
          }, {
            easing: 'sineOut'
          }).start();
        }

        onTouchCancel(event) {
          // Return to original scale if touch is cancelled
          tween(this.node).to(0.1, {
            scale: this.originalScale
          }, {
            easing: 'sineOut'
          }).start();
        }

        onTouchEnd(event) {
          // Return to original scale with a bounce effect
          tween(this.node).to(0.15, {
            scale: this.originalScale
          }, {
            easing: 'backOut'
          }).start(); // Proceed with the redirect

          this.onClick();
        }

        onClick() {
          const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent) || navigator.userAgent.includes("Macintosh");
          const isAndroid = /Android/i.test(navigator.userAgent);
          const appStoreURL = this.IosLink;
          const playStoreURL = this.PlayStoreLink;
          const targetURL = isIOS ? appStoreURL : playStoreURL;
          (_crd && AdManager === void 0 ? (_reportPossibleCrUseOfAdManager({
            error: Error()
          }), AdManager) : AdManager).openStore(targetURL);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "IosLink", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "PlayStoreLink", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return "";
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=d4eb8080b71c7d5c1350164d18a8b9233facc9cd.js.map