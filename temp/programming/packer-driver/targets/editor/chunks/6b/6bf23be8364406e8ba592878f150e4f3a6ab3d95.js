System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Prefab, _dec, _dec2, _class, _class2, _descriptor, _dec3, _dec4, _class4, _class5, _descriptor2, _crd, ccclass, property, EggTier, EggDatabase;

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
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "bb2b7fsfwxMNLFIip41vFUE", "EggDatabase", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Prefab']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * One step in the merge ladder. `prefab` is the PHYSICS body for this tier
       * (Egg1..Egg7): shadow root + RigidBody2D + CircleCollider2D + Egg.ts + an
       * "Egg Art" child sprite. The art baked into the prefab is only a placeholder;
       * at spawn the game overwrites it with the current theme's art via
       * egg.setArt(themeManager.tierSprite(tier)). So all this needs is the prefab.
       */

      _export("EggTier", EggTier = (_dec = ccclass('EggTier'), _dec2 = property(Prefab), _dec(_class = (_class2 = class EggTier {
        constructor() {
          /** Physics prefab for this tier. Index order = merge order (0 = lowest). */
          _initializerDefineProperty(this, "prefab", _descriptor, this);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "prefab", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      })), _class2)) || _class));
      /**
       * Ordered merge chain. Lives on GameController.
       * Drag the prefabs in tier order: index 0 = tier 1 (lowest), last = top tier.
       * Endless game: there is no win target.
       */


      _export("EggDatabase", EggDatabase = (_dec3 = ccclass('EggDatabase'), _dec4 = property({
        type: [EggTier]
      }), _dec3(_class4 = (_class5 = class EggDatabase extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "tiers", _descriptor2, this);
        }

        get count() {
          return this.tiers.length;
        }

        getTier(index) {
          if (index < 0 || index >= this.tiers.length) return null;
          return this.tiers[index];
        }

      }, (_descriptor2 = _applyDecoratedDescriptor(_class5.prototype, "tiers", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return [];
        }
      })), _class5)) || _class4));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=6bf23be8364406e8ba592878f150e4f3a6ab3d95.js.map