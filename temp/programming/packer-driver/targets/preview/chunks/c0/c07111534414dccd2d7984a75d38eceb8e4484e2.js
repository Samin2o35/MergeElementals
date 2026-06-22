System.register(["__unresolved_0", "cc"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Input, Vec2, Vec3, Camera, UITransform, CircleCollider2D, ERigidBody2DType, math, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _crd, ccclass, property, Launcher;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEgg(extras) {
    _reporterNs.report("Egg", "./Egg", _context.meta, extras);
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
      Input = _cc.Input;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      Camera = _cc.Camera;
      UITransform = _cc.UITransform;
      CircleCollider2D = _cc.CircleCollider2D;
      ERigidBody2DType = _cc.ERigidBody2DType;
      math = _cc.math;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "d747acnZdJKx5ksNKgDCpzr", "Launcher", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Input', 'EventTouch', 'Vec2', 'Vec3', 'Camera', 'UITransform', 'CircleCollider2D', 'ERigidBody2DType', 'math']);

      ({
        ccclass,
        property
      } = _decorator);
      /**
       * Tasty-Travels style launcher. Press + drag slides the launcher along X
       * (clamped to the table), release shoots the egg. Because the board is in
       * perspective, the shot tilts with position: left edge -maxAimAngleDeg,
       * centre 0, right edge +maxAimAngleDeg.
       *
       * The held egg is reparented UNDER the launcher while docked (so it renders
       * above the aim line and follows the slide), then reparented back to its
       * original container on launch.
       */

      _export("Launcher", Launcher = (_dec = ccclass('Launcher'), _dec2 = property(Node), _dec3 = property(Camera), _dec4 = property(Node), _dec5 = property({
        tooltip: 'How far inside the table edges the launcher can slide (px). Higher = stays more central, off the rails.'
      }), _dec6 = property(Node), _dec7 = property({
        tooltip: 'Initial speed straight up the table. Higher = flies faster/further (hits back wall harder).'
      }), _dec8 = property({
        tooltip: 'Shot tilt at the table edges (deg) for the perspective lane. Left edge = -this, centre = 0, right edge = +this. Negate to converge inward.'
      }), _dec9 = property({
        tooltip: 'ON = aim line always shown while an egg is docked. OFF = only while dragging.'
      }), _dec(_class = (_class2 = class Launcher extends Component {
        constructor() {
          super(...arguments);

          /** Node that receives touch input — usually the Board play surface. */
          _initializerDefineProperty(this, "inputArea", _descriptor, this);

          /** Camera used to convert screen touches to world space. REQUIRED. */
          _initializerDefineProperty(this, "gameCamera", _descriptor2, this);

          /** Table/board node — its world bounds define the X slide range. */
          _initializerDefineProperty(this, "boundsNode", _descriptor3, this);

          _initializerDefineProperty(this, "wallInset", _descriptor4, this);

          /** Aim guide (the Line sprite). Keep it a child of Launcher; set its anchor Y to 0 so it pivots from the base. */
          _initializerDefineProperty(this, "aimGuide", _descriptor5, this);

          _initializerDefineProperty(this, "launchSpeed", _descriptor6, this);

          _initializerDefineProperty(this, "maxAimAngleDeg", _descriptor7, this);

          _initializerDefineProperty(this, "aimAlwaysVisible", _descriptor8, this);

          this._minX = 0;
          this._maxX = 0;
          this._currentEgg = null;
          this._dockParent = null;
          this._aiming = false;
          this._onLaunched = null;
          this._locked = true;
        }

        start() {
          var _this$inputArea;

          this.computeBounds();
          var area = (_this$inputArea = this.inputArea) != null ? _this$inputArea : this.node;
          area.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
          area.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          area.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          area.on(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
          this.updateAimVisibility();
        }

        onDestroy() {
          var _this$inputArea2;

          var area = (_this$inputArea2 = this.inputArea) != null ? _this$inputArea2 : this.node;
          area.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
          area.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
          area.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
          area.off(Input.EventType.TOUCH_CANCEL, this.onTouchEnd, this);
        }
        /** Dock an egg in the launcher; onLaunched fires on throw. */


        loadEgg(egg, onLaunched) {
          this._currentEgg = egg;
          this._onLaunched = onLaunched;
          this._dockParent = egg.node.parent; // remember the Eggs container

          egg.setBodyType(ERigidBody2DType.Kinematic); // manually-moved while held

          egg.stopMotion();
          egg.mergeable = false;
          egg.node.setParent(this.node, false); // dock under launcher (renders above the Line child)

          egg.node.setPosition(0, 0, 0); // sit at the launcher origin

          this._locked = false;
          this.updateAimVisibility();
          this.updateAim();
        }
        /** Stop accepting input (win/lose). */


        disable() {
          this._locked = true;
          this._aiming = false;
          if (this.aimGuide) this.aimGuide.active = false;
        }

        onTouchStart(_e) {
          if (this._locked || !this._currentEgg) return;
          this._aiming = true;
          this.updateAimVisibility();
          this.updateAim();
        }

        onTouchMove(e) {
          if (!this._aiming) return;
          var p = e.getLocation(); // screen pixels

          this.slideTo(p.x, p.y);
        }

        onTouchEnd(_e) {
          var _this$_onLaunched;

          if (!this._aiming || this._locked || !this._currentEgg) {
            this._aiming = false;
            return;
          }

          this._aiming = false;
          this._locked = true;
          var egg = this._currentEgg;
          var dir = this.currentAimDir(); // capture before clearing

          egg.node.setParent(this._dockParent, true); // back to Eggs container, keep world pos

          this._currentEgg = null;
          this.updateAimVisibility(); // no egg => hidden

          egg.launch(dir, this.launchSpeed);
          (_this$_onLaunched = this._onLaunched) == null || _this$_onLaunched.call(this);
        }
        /** Move launcher (and its docked egg + aim line children) to a clamped world X. */


        slideTo(screenX, screenY) {
          var r = this.heldRadiusWorld(); // keep the whole egg inside, not just its center

          var wx = math.clamp(this.screenToWorldX(screenX, screenY), this._minX + r, this._maxX - r);
          var wp = this.node.worldPosition;
          this.node.setWorldPosition(wx, wp.y, wp.z);
          this.updateAim();
        }
        /** Rotate the aim line to preview the (position-based) shot tilt. */


        updateAim() {
          if (this.aimGuide) this.aimGuide.angle = -this.currentAimAngleDeg();
        }
        /** Aim line shown when an egg is docked and (always-visible OR actively aiming). */


        updateAimVisibility() {
          if (!this.aimGuide) return;
          this.aimGuide.active = !!this._currentEgg && (this.aimAlwaysVisible || this._aiming);
        }
        /** Tilt in degrees from the launcher's X: -max at left edge, 0 centre, +max at right edge. */


        currentAimAngleDeg() {
          var r = this.heldRadiusWorld();
          var lo = this._minX + r;
          var hi = this._maxX - r;
          var half = (hi - lo) / 2;
          if (half <= 0.0001) return 0;
          var center = (lo + hi) / 2;
          var t = math.clamp((this.node.worldPosition.x - center) / half, -1, 1);
          return -t * this.maxAimAngleDeg; // left edge => lean right, right edge => lean left
        }
        /** Launch direction matching the current tilt (straight up = (0,1)). */


        currentAimDir() {
          var a = math.toRadian(this.currentAimAngleDeg());
          return new Vec2(Math.sin(a), Math.cos(a));
        }

        heldRadiusWorld() {
          if (!this._currentEgg) return 0;

          var col = this._currentEgg.getComponent(CircleCollider2D);

          if (!col) return 0;
          return col.radius * Math.abs(this._currentEgg.node.worldScale.x);
        }

        screenToWorldX(screenX, screenY) {
          if (this.gameCamera) {
            var out = new Vec3();
            this.gameCamera.screenToWorld(new Vec3(screenX, screenY, 0), out);
            return out.x;
          }

          return screenX;
        }

        computeBounds() {
          var _this$boundsNode;

          var ref = (_this$boundsNode = this.boundsNode) != null ? _this$boundsNode : this.inputArea;
          var uit = ref ? ref.getComponent(UITransform) : null;

          if (!uit) {
            this._minX = -300;
            this._maxX = 300;
            return;
          }

          var bb = uit.getBoundingBoxToWorld();
          this._minX = bb.xMin + this.wallInset;
          this._maxX = bb.xMax - this.wallInset;
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "inputArea", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "gameCamera", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "boundsNode", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "wallInset", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 40;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "aimGuide", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "launchSpeed", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 30;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "maxAimAngleDeg", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return 10;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "aimAlwaysVisible", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function initializer() {
          return false;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=c07111534414dccd2d7984a75d38eceb8e4484e2.js.map