System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Sprite, RigidBody2D, CircleCollider2D, Contact2DType, ERigidBody2DType, Vec2, _dec, _dec2, _class, _class2, _descriptor, _crd, ccclass, property, Egg;

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
      Sprite = _cc.Sprite;
      RigidBody2D = _cc.RigidBody2D;
      CircleCollider2D = _cc.CircleCollider2D;
      Contact2DType = _cc.Contact2DType;
      ERigidBody2DType = _cc.ERigidBody2DType;
      Vec2 = _cc.Vec2;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "62805YO3sNEjrVdkQk70rOd", "Egg", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Sprite', 'RigidBody2D', 'CircleCollider2D', 'Collider2D', 'Contact2DType', 'ERigidBody2DType', 'Vec2']);

      ({
        ccclass,
        property
      } = _decorator);

      /**
       * Lives on the SHADOW root node of each egg prefab (shadow = parent, art = child).
       * Reports contacts to the controller, which decides merge vs egg-hit vs wall-hit.
       */
      _export("Egg", Egg = (_dec = ccclass('Egg'), _dec2 = property(Sprite), _dec(_class = (_class2 = class Egg extends Component {
        constructor() {
          super(...arguments);

          _initializerDefineProperty(this, "eggArt", _descriptor, this);

          this.tier = 0;
          this.mergeable = true;
          // false while docked in the launcher
          this.consumed = false;
          // guards double-merge
          this.launched = false;
          this.enteredField = false;
          // crossed above the lose line once
          this._rb = null;
          this._col = null;
          this._contactCb = null;
          this._mergeReadyAt = 0;
        }

        onLoad() {
          this._rb = this.getComponent(RigidBody2D);
          this._col = this.getComponent(CircleCollider2D);
          if (this._col) this._col.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }

        onDestroy() {
          if (this._col) this._col.off(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
        }
        /** Call BEFORE addChild — sets serialized physics values read on fixture creation. */


        init(o) {
          this.tier = o.tier;
          this.consumed = false;
          this.launched = false;
          this.enteredField = false;
          this.mergeable = true;
          this._contactCb = o.contactCb;
          var col = this.getComponent(CircleCollider2D);

          if (col) {
            col.restitution = o.restitution;
            col.friction = o.friction;
            col.density = o.density;
          }

          var rb = this.getComponent(RigidBody2D);
          if (rb) rb.linearDamping = o.linearDamping;
        }

        setBodyType(type) {
          var _this$_rb;

          var rb = (_this$_rb = this._rb) != null ? _this$_rb : this.getComponent(RigidBody2D);
          if (rb) rb.type = type;
        }

        launch(dir, speed) {
          this.launched = true;
          this.mergeable = true;
          if (!this._rb) return;
          this._rb.type = ERigidBody2DType.Dynamic;
          this._rb.linearVelocity = dir.clone().normalize().multiplyScalar(speed);
        }

        stopMotion() {
          if (!this._rb) return;
          this._rb.linearVelocity = new Vec2(0, 0);
          this._rb.angularVelocity = 0;
        }

        getSpeed() {
          return this._rb ? this._rb.linearVelocity.length() : 0;
        }

        getVelocity() {
          return this._rb ? this._rb.linearVelocity.clone() : new Vec2(0, 0);
        }

        setVelocity(v) {
          if (this._rb) this._rb.linearVelocity = v;
        }

        /** Block this egg from merging for `seconds` (lets a fresh merge's pop-in finish). */
        setMergeGrace(seconds) {
          this._mergeReadyAt = Date.now() / 1000 + seconds;
        }

        get canMerge() {
          return Date.now() / 1000 >= this._mergeReadyAt;
        }

        onBeginContact(_self, other) {
          var _this$_contactCb;

          if (this.consumed) return;
          var o = other.getComponent(Egg); // null => wall

          (_this$_contactCb = this._contactCb) == null || _this$_contactCb.call(this, this, o);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "eggArt", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=9b0de44eecc6db8929491abf9b63ffeb9d0705b7.js.map