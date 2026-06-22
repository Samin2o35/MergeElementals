System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Vec3, Color, tween, UIOpacity, Graphics, UITransform, CCInteger, CCFloat, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _class3, _crd, ccclass, property, MergeEffect;

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
      Vec3 = _cc.Vec3;
      Color = _cc.Color;
      tween = _cc.tween;
      UIOpacity = _cc.UIOpacity;
      Graphics = _cc.Graphics;
      UITransform = _cc.UITransform;
      CCInteger = _cc.CCInteger;
      CCFloat = _cc.CCFloat;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "e124ewanR1B4YnToQ1rj2Mx", "MergeEffect", undefined);
      /**
       * MergeEffect.ts
       * Attach to: MergeFX prefab (empty node, anchor 0.5/0.5)
       *
       * Tasty-Travels style merge burst, fully code-driven (no assets):
       *   1. A quick central white flash that pops and fades
       *   2. An expanding soft glow RING (shockwave) that fades as it grows
       *   3. A ring of twinkling 4-point SPARKLE stars (gold + white) that fly
       *      outward, scale up then shrink, rotate slightly, and fade
       *
       * Self-destructs when complete. The merged egg's own scale-bounce is handled
       * by the controller; this is the sparkle layer on top.
       */


      __checkObsolete__(['_decorator', 'Component', 'Node', 'Vec3', 'Color', 'tween', 'UIOpacity', 'Graphics', 'UITransform', 'CCInteger', 'CCFloat']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("MergeEffect", MergeEffect = (_dec = ccclass('MergeEffect'), _dec2 = property({
        type: CCFloat,
        tooltip: 'Radius of the central white flash.'
      }), _dec3 = property({
        type: CCFloat,
        tooltip: 'How far the glow ring expands (px).'
      }), _dec4 = property({
        type: CCInteger,
        tooltip: 'Number of sparkle stars in the burst.'
      }), _dec5 = property({
        type: CCFloat,
        tooltip: 'How far the sparkles fly from centre (px).'
      }), _dec6 = property({
        type: CCFloat,
        tooltip: 'Size of each sparkle star (px).'
      }), _dec7 = property({
        type: CCFloat,
        tooltip: 'Total duration before the node self-destructs.'
      }), _dec(_class = (_class2 = (_class3 = class MergeEffect extends Component {
        constructor(...args) {
          super(...args);

          // ======================================================
          // INSPECTOR (fine-tuning)
          // ======================================================
          _initializerDefineProperty(this, "flashRadius", _descriptor, this);

          _initializerDefineProperty(this, "ringRadius", _descriptor2, this);

          _initializerDefineProperty(this, "sparkleCount", _descriptor3, this);

          _initializerDefineProperty(this, "sparkleDistance", _descriptor4, this);

          _initializerDefineProperty(this, "sparkleSize", _descriptor5, this);

          _initializerDefineProperty(this, "duration", _descriptor6, this);
        }

        // ======================================================
        // PUBLIC API
        // ======================================================

        /** Trigger the effect. Call immediately after addChild + setWorldPosition. */
        play(colors = MergeEffect.DEFAULT_COLORS) {
          var _colors$;

          const accent = (_colors$ = colors[0]) != null ? _colors$ : MergeEffect.GOLD;
          this.spawnFlash();
          this.spawnRing(accent);

          for (let i = 0; i < this.sparkleCount; i++) {
            const baseAngle = i / this.sparkleCount * Math.PI * 2;
            const jitter = (Math.random() - 0.5) * 0.4;
            const col = i % 2 === 0 ? MergeEffect.WHITE : accent;
            this.spawnSparkle(baseAngle + jitter, col);
          }

          this.scheduleOnce(() => {
            if (this.node.isValid) this.node.destroy();
          }, this.duration);
        } // ======================================================
        // CENTRAL FLASH
        // ======================================================


        spawnFlash() {
          const node = new Node('flash');
          node.addComponent(UITransform);
          this.node.addChild(node);
          const g = node.addComponent(Graphics);
          g.fillColor = new Color(255, 255, 235, 255);
          g.circle(0, 0, this.flashRadius);
          g.fill();
          const op = node.addComponent(UIOpacity);
          node.setScale(new Vec3(0.3, 0.3, 1));
          tween(node).to(0.16, {
            scale: new Vec3(1.6, 1.6, 1)
          }, {
            easing: 'quadOut'
          }).start();
          tween(op).to(0.20, {
            opacity: 0
          }, {
            easing: 'sineIn'
          }).start();
        } // ======================================================
        // GLOW RING (shockwave)
        // ======================================================


        spawnRing(color) {
          const node = new Node('ring');
          node.addComponent(UITransform);
          this.node.addChild(node);
          const g = node.addComponent(Graphics);
          g.lineWidth = 7;
          g.strokeColor = new Color(color.r, color.g, color.b, 255);
          g.circle(0, 0, this.ringRadius);
          g.stroke();
          const op = node.addComponent(UIOpacity);
          node.setScale(new Vec3(0.25, 0.25, 1));
          tween(node).to(0.34, {
            scale: new Vec3(1, 1, 1)
          }, {
            easing: 'quadOut'
          }).start();
          tween(op).to(0.34, {
            opacity: 0
          }, {
            easing: 'quadOut'
          }).start();
        } // ======================================================
        // SPARKLE STARS
        // ======================================================

        /** Twinkling 4-point star that flies outward, peaks, then shrinks + fades. */


        spawnSparkle(angle, color) {
          const node = new Node('sparkle');
          node.addComponent(UITransform);
          this.node.addChild(node);
          const g = node.addComponent(Graphics);
          g.fillColor = color;
          this.drawSparkle(g, this.sparkleSize);
          const op = node.addComponent(UIOpacity);
          node.setScale(new Vec3(0, 0, 1));
          const startAngle = Math.random() * 90;
          node.angle = startAngle;
          const dist = this.sparkleDistance * (0.7 + Math.random() * 0.5);
          const tx = Math.cos(angle) * dist;
          const ty = Math.sin(angle) * dist;
          tween(node).to(0.14, {
            position: new Vec3(tx, ty, 0),
            scale: new Vec3(1.1, 1.1, 1),
            angle: startAngle + 35
          }, {
            easing: 'quadOut'
          }).to(0.22, {
            scale: new Vec3(0.35, 0.35, 1),
            angle: startAngle + 60
          }, {
            easing: 'quadIn'
          }).start();
          tween(op).delay(0.16).to(0.20, {
            opacity: 0
          }, {
            easing: 'sineIn'
          }).start();
        }
        /** Draw a 4-point sparkle (8-vertex star) centred at the origin. */


        drawSparkle(g, size) {
          const outer = size;
          const inner = size * 0.32;
          const pts = 4;

          for (let i = 0; i < pts * 2; i++) {
            const r = i % 2 === 0 ? outer : inner;
            const a = i / (pts * 2) * Math.PI * 2 - Math.PI / 2;
            const x = Math.cos(a) * r;
            const y = Math.sin(a) * r;
            if (i === 0) g.moveTo(x, y);else g.lineTo(x, y);
          }

          g.close();
          g.fill();
        }

      }, _class3.GOLD = new Color(255, 210, 90, 255), _class3.LIGHT_GOLD = new Color(255, 236, 160, 255), _class3.WHITE = new Color(255, 255, 255, 255), _class3.DEFAULT_COLORS = [_class3.GOLD, _class3.WHITE, _class3.LIGHT_GOLD], _class3.TIER_COLORS = [[_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE], [_class3.GOLD, _class3.WHITE]], _class3), (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "flashRadius", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 26;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "ringRadius", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 60;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "sparkleCount", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 7;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "sparkleDistance", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 55;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "sparkleSize", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 13;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "duration", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=99a9c716ec9df3c46d0fd212c94deb7cdb48030f.js.map