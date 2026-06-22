System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, pulseNode, AdEvent, AdManager, _dec, _class, _crd, ccclass, property, PlayableUiCanvasFix;

  function _reportPossibleCrUseOfpulseNode(extras) {
    _reporterNs.report("pulseNode", "./Helper", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAdEvent(extras) {
    _reporterNs.report("AdEvent", "./AdManager", _context.meta, extras);
  }

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
    }, function (_unresolved_2) {
      pulseNode = _unresolved_2.pulseNode;
    }, function (_unresolved_3) {
      AdEvent = _unresolved_3.AdEvent;
      AdManager = _unresolved_3.AdManager;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "5a1b8ZvfBtNq5K+VJtktmTf", "PlayableUiCanvasFix", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Camera', 'RenderTexture', 'Texture2D', 'Sprite', 'SpriteFrame', 'Size']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("PlayableUiCanvasFix", PlayableUiCanvasFix = (_dec = ccclass('PlayableUiCanvasFix'), _dec(_class = class PlayableUiCanvasFix extends Component {
        // @property(Camera)
        // public sceneCamera: Camera = null;
        // @property(Camera)
        // public uiCamera: Camera = null;
        onLoad() {
          // this.setupRenderTexture();
          (_crd && AdManager === void 0 ? (_reportPossibleCrUseOfAdManager({
            error: Error()
          }), AdManager) : AdManager).on((_crd && AdEvent === void 0 ? (_reportPossibleCrUseOfAdEvent({
            error: Error()
          }), AdEvent) : AdEvent).VIEWABLE_CHANGE, this.onViewableChange.bind(this));
        } // protected start(): void {        
        // }
        // private setupRenderTexture() {
        //     if (!this.sceneCamera || !this.uiCamera) {
        //         console.error('Scene camera and UI camera must be assigned!');
        //         return;
        //     }
        //     this.sceneCamera.targetTexture = this.uiCamera.targetTexture;
        //     this.uiCamera.clearFlags = Camera.ClearFlag.DONT_CLEAR;
        //     this.uiCamera.priority = this.sceneCamera.priority + 1;
        // }


        onViewableChange(percentage, visibleRect, occlusionRectangles) {
          console.log(`Ad viewable percentage: ${percentage}`);
          (_crd && pulseNode === void 0 ? (_reportPossibleCrUseOfpulseNode({
            error: Error()
          }), pulseNode) : pulseNode)(this.node, 1, 0.2, 1.01);
        }

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=76e1aa90b4f4be8648777a104504e002eaf73d06.js.map