System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, tween, v3, Vec3, _crd;

  function pulseNode(node, repeatCount = 9999, durationPerPulse = 0.4, scaleFactor = 1.1) {
    const dataKey = '__pulseData__' + node.uuid;
    let pulseData = node[dataKey];

    if (pulseData) {
      var _pulseData$tween;

      (_pulseData$tween = pulseData.tween) == null || _pulseData$tween.stop();
      node.setScale(pulseData.baseScale);
    }

    const baseScale = node.getScale().clone();
    const upScale = v3(baseScale.x * scaleFactor, baseScale.y * scaleFactor, baseScale.z);
    const pulseTween = tween(node).to(durationPerPulse, {
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

    const dataKey = '__pulseData__';
    const pulseData = node[dataKey];
    if (!pulseData) return;
    (_pulseData$tween2 = pulseData.tween) == null || _pulseData$tween2.stop();
    node.setScale(pulseData.baseScale);
    node[dataKey] = null;
  }

  function shakeNode(node, duration = 0.3, strength = 10, vibrateCount = 8, onComplete) {
    const originalPos = node.getPosition();
    const shakes = [];

    for (let i = 0; i < vibrateCount; i++) {
      const dx = (Math.random() * 2 - 1) * strength;
      const dy = (Math.random() * 2 - 1) * strength;
      shakes.push(tween().to(duration / vibrateCount, {
        position: new Vec3(originalPos.x + dx, originalPos.y + dy, originalPos.z)
      }));
    }

    shakes.push(tween().to(0.05, {
      position: originalPos
    }));
    const seq = tween(node);
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