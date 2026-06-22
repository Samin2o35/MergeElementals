System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Label, Sprite, SpriteFrame, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _crd, ccclass, property, EndCard;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      Node = _cc.Node;
      Label = _cc.Label;
      Sprite = _cc.Sprite;
      SpriteFrame = _cc.SpriteFrame;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "6af28Oab5NJhI5vwIgarMpo", "EndCard", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Label', 'Sprite', 'SpriteFrame']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("EndCard", EndCard = (_dec = ccclass('EndCard'), _dec2 = property(Label), _dec3 = property(Sprite), _dec4 = property(Sprite), _dec5 = property(SpriteFrame), _dec6 = property(SpriteFrame), _dec7 = property(SpriteFrame), _dec8 = property(SpriteFrame), _dec(_class = (_class2 = class EndCard extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "disclaimerLabel", _descriptor, this);

          _initializerDefineProperty(this, "ctaSprite", _descriptor2, this);

          _initializerDefineProperty(this, "buttonSprite", _descriptor3, this);

          _initializerDefineProperty(this, "winCtaFrame", _descriptor4, this);

          _initializerDefineProperty(this, "loseCtaFrame", _descriptor5, this);

          _initializerDefineProperty(this, "winButtonFrame", _descriptor6, this);

          _initializerDefineProperty(this, "loseButtonFrame", _descriptor7, this);

          _initializerDefineProperty(this, "winText", _descriptor8, this);

          _initializerDefineProperty(this, "loseText", _descriptor9, this);

          this.onRedirect = null;
        }

        /** Show the end card in its win or lose variant. */
        show(won, onRedirect) {
          this.onRedirect = onRedirect;
          this.node.active = true;

          if (this.disclaimerLabel) {
            this.disclaimerLabel.string = won ? this.winText : this.loseText;
          }

          if (this.ctaSprite) {
            var frame = won ? this.winCtaFrame : this.loseCtaFrame;
            if (frame) this.ctaSprite.spriteFrame = frame;
          }

          if (this.buttonSprite) {
            var _frame = won ? this.winButtonFrame : this.loseButtonFrame;

            if (_frame) this.buttonSprite.spriteFrame = _frame;
          }

          this.node.on(Node.EventType.TOUCH_END, this.onTapped, this);
        }

        onTapped() {
          this.node.off(Node.EventType.TOUCH_END, this.onTapped, this);
          var cb = this.onRedirect;
          this.onRedirect = null;
          cb == null || cb();
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "disclaimerLabel", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ctaSprite", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "buttonSprite", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "winCtaFrame", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "loseCtaFrame", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "winButtonFrame", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "loseButtonFrame", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "winText", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'You created the wanted Egg';
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "loseText", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 'You ran out of room';
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=3f4bdfd22bdb1ab1b010596ee601f723f2161545.js.map