System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, SpriteFrame, CCInteger, _dec, _dec2, _dec3, _class, _class2, _descriptor, _descriptor2, _descriptor3, _dec4, _dec5, _dec6, _class4, _class5, _descriptor4, _descriptor5, _crd, ccclass, property, EggTier, EggDatabase;

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
      Prefab = _cc.Prefab;
      SpriteFrame = _cc.SpriteFrame;
      CCInteger = _cc.CCInteger;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bb2b7fsfwxMNLFIip41vFUE", "EggDatabase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab', 'SpriteFrame', 'CCInteger']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * One step in the merge ladder. Now that each egg is its own prefab, the
       * shape/art/shadow/collider all live in `prefab`. `icon` is the egg-art
       * SpriteFrame used purely for UI (Next Up panel + Create This Egg panel).
       */

      _export("EggTier", EggTier = (_dec = ccclass('EggTier'), _dec2 = property(Prefab), _dec3 = property(SpriteFrame), _dec(_class = (_class2 = class EggTier {
        constructor() {
          /** Board prefab for this tier (Egg1..Egg9). */
          _initializerDefineProperty(this, "prefab", _descriptor, this);

          /** Egg-art SpriteFrame for the Next Up + Target UI panels. */
          _initializerDefineProperty(this, "icon", _descriptor2, this);

          _initializerDefineProperty(this, "displayName", _descriptor3, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "icon", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "displayName", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return '';
        }
      })), _class2)) || _class));
      /**
       * Ordered merge chain + the win-target tier. Lives on GameController.
       * Drag the prefabs in tier order: index 0 = tier 1 (lowest), last = final egg.
       */


      _export("EggDatabase", EggDatabase = (_dec4 = ccclass('EggDatabase'), _dec5 = property({
        type: [EggTier]
      }), _dec6 = property({
        type: CCInteger
      }), _dec4(_class4 = (_class5 = class EggDatabase extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "tiers", _descriptor4, this);

          /** 0-based winning index. For 9 eggs the final egg is index 8. */
          _initializerDefineProperty(this, "targetTierIndex", _descriptor5, this);
        }

        get count() {
          return this.tiers.length;
        }

        getTier(index) {
          if (index < 0 || index >= this.tiers.length) return null;
          return this.tiers[index];
        }
        /** Clamped target so an out-of-range value can't break the win check. */


        get effectiveTarget() {
          return Math.min(Math.max(this.targetTierIndex, 0), this.count - 1);
        }

      }, (_descriptor4 = _applyDecoratedDescriptor(_class5.prototype, "tiers", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return [];
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class5.prototype, "targetTierIndex", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 0;
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=497f3a589c1b274ba9ba7abb3fa9b8d3726e3677.js.map