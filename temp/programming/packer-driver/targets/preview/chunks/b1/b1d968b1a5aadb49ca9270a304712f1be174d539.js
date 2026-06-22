System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Size, view, Widget, _dec, _class, _class2, _descriptor, _crd, ccclass, property, LayoutResponsive;

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
      Size = _cc.Size;
      view = _cc.view;
      Widget = _cc.Widget;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "64ea4N9ysJJbo3WMR3T8Vua", "LayoutResponsive", undefined);

      __checkObsolete__(['_decorator', 'BoxCollider2D', 'Canvas', 'Collider2D', 'Component', 'ECollider2DType', 'find', 'Node', 'Size', 'UITransform', 'Vec2', 'view', 'Widget']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("LayoutResponsive", LayoutResponsive = (_dec = ccclass('LayoutResponsive'), _dec(_class = (_class2 = class LayoutResponsive extends Component {
        constructor() {
          super(...arguments);
          this.m_widget = void 0;
          this.m_originalLeft = 0;
          this.m_originalRight = 0;
          this.m_originalTop = 0;
          this.m_originalBottom = 0;
          this.m_isResized = true;

          _initializerDefineProperty(this, "ApplyAlways", _descriptor, this);
        }

        start() {
          this.m_widget = this.node.getComponent(Widget);
          this.m_originalLeft = this.m_widget.left;
          this.m_originalRight = this.m_widget.right;
          this.m_originalTop = this.m_widget.top;
          this.m_originalBottom = this.m_widget.bottom;
          window.addEventListener("resize", () => {
            this.m_isResized = true;
          });
          this.setResponsivePosition();
        }

        setResponsivePosition() {
          var canvasSize = new Size(window.innerWidth, window.innerHeight); //view.getCanvasSize();

          var designSize = view.getDesignResolutionSize();
          var canvasAspect = canvasSize.width / canvasSize.height;
          var designAspect = designSize.width / designSize.height;
          var ratioDiff = Math.abs(canvasAspect - designAspect);
          var isSameRatio = ratioDiff < 0.01;

          if (isSameRatio) {
            // Reset to original margins if same aspect
            this.m_widget.left = this.m_originalLeft;
            this.m_widget.right = this.m_originalRight;
            this.m_widget.top = this.m_originalTop;
            this.m_widget.bottom = this.m_originalBottom;
          } else {
            if (canvasAspect > designAspect) {
              // Wider screen → add horizontal padding
              var scaleFactor = canvasSize.height / designSize.height;
              var adjustedDesignWidth = designSize.width * scaleFactor;
              var padding = (canvasSize.width - adjustedDesignWidth) / 2;
              var marginOffset = padding / scaleFactor;
              if (this.m_widget.isAlignLeft) this.m_widget.left = this.m_originalLeft - marginOffset;
              if (this.m_widget.isAlignRight) this.m_widget.right = this.m_originalRight - marginOffset; // Reset vertical margins

              this.m_widget.top = this.m_originalTop;
              this.m_widget.bottom = this.m_originalBottom;
            } else {
              // Taller screen → add vertical padding
              var _scaleFactor = canvasSize.width / designSize.width;

              var adjustedDesignHeight = designSize.height * _scaleFactor;

              var _padding = (canvasSize.height - adjustedDesignHeight) / 2;

              var _marginOffset = _padding / _scaleFactor;

              if (this.m_widget.isAlignTop) this.m_widget.top = this.m_originalTop - _marginOffset;
              if (this.m_widget.isAlignBottom) this.m_widget.bottom = this.m_originalBottom - _marginOffset; // Reset horizontal margins

              this.m_widget.left = this.m_originalLeft;
              this.m_widget.right = this.m_originalRight;
            }
          }

          this.m_widget.updateAlignment();
        }

        update(deltaTime) {
          if (this.ApplyAlways) {
            this.setResponsivePosition();
          }

          if (this.m_isResized) {
            this.setResponsivePosition();
            this.m_isResized = false;
          }
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "ApplyAlways", [property], {
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
//# sourceMappingURL=b1d968b1a5aadb49ca9270a304712f1be174d539.js.map