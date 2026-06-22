System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, tween, v3, Vec3, _crd;

  function pulseNode(node, repeatCount, durationPerPulse, scaleFactor) {
    if (repeatCount === void 0) {
      repeatCount = 9999;
    }

    if (durationPerPulse === void 0) {
      durationPerPulse = 0.4;
    }

    if (scaleFactor === void 0) {
      scaleFactor = 1.1;
    }

    var dataKey = '__pulseData__' + node.uuid;
    var pulseData = node[dataKey];

    if (pulseData) {
      var _pulseData$tween;

      (_pulseData$tween = pulseData.tween) == null || _pulseData$tween.stop();
      node.setScale(pulseData.baseScale);
    }

    var baseScale = node.getScale().clone();
    var upScale = v3(baseScale.x * scaleFactor, baseScale.y * scaleFactor, baseScale.z);
    var pulseTween = tween(node).to(durationPerPulse, {
      scale: upScale
    }).to(durationPerPulse, {
      scale: baseScale
    }).repeat(repeatCount).call(() => {
      node.setScale(baseScale);
      node[dataKey] = null;
    });
    node[dataKey] = {
      tween: pulseTween,
      baseScale
    };
    pulseTween.start();
  }

  function stopPulse(node) {
    var _pulseData$tween2;

    var dataKey = '__pulseData__';
    var pulseData = node[dataKey];
    if (!pulseData) return;
    (_pulseData$tween2 = pulseData.tween) == null || _pulseData$tween2.stop();
    node.setScale(pulseData.baseScale);
    node[dataKey] = null;
  }

  function shakeNode(node, duration, strength, vibrateCount, onComplete) {
    if (duration === void 0) {
      duration = 0.3;
    }

    if (strength === void 0) {
      strength = 10;
    }

    if (vibrateCount === void 0) {
      vibrateCount = 8;
    }

    var originalPos = node.getPosition();
    var shakes = [];

    for (var i = 0; i < vibrateCount; i++) {
      var dx = (Math.random() * 2 - 1) * strength;
      var dy = (Math.random() * 2 - 1) * strength;
      shakes.push(tween().to(duration / vibrateCount, {
        position: new Vec3(originalPos.x + dx, originalPos.y + dy, originalPos.z)
      }));
    }

    shakes.push(tween().to(0.05, {
      position: originalPos
    }));
    var seq = tween(node);
    shakes.forEach(s => seq.then(s));
    seq.call(() => {
      if (onComplete) onComplete();
    }).start();
  }

  _export({
    pulseNode: pulseNode,
    stopPulse: stopPulse,
    shakeNode: shakeNode
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      tween = _cc.tween;
      v3 = _cc.v3;
      Vec3 = _cc.Vec3;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "9f23cjjMMtGw7fHD2JgzXmv", "Helper", undefined);

      __checkObsolete__(['_decorator', 'animation', 'Camera', 'Component', 'Game', 'Node', 'tween', 'v3', 'Vec2', 'Vec3']);

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=bcf70b6d52975e783373e663c7db706abd4b5613.js.map