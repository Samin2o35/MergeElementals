System.register(["__unresolved_0", "cc", "__unresolved_1", "__unresolved_2", "__unresolved_3", "__unresolved_4", "__unresolved_5", "__unresolved_6", "__unresolved_7", "__unresolved_8", "__unresolved_9", "__unresolved_10"], function (_export, _context) {
  "use strict";

  var _reporterNs, _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, Node, Prefab, instantiate, Sprite, Vec2, Vec3, PhysicsSystem2D, tween, Tween, director, Egg, EggDatabase, Launcher, GameManager, GlobalAudioManager, AudioContent, MergeEffect, ThemeManager, THEME_CHANGED, RoundManager, DESTROY_PIECES, CameraShake, _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _dec12, _dec13, _dec14, _dec15, _dec16, _dec17, _dec18, _dec19, _dec20, _dec21, _dec22, _dec23, _dec24, _dec25, _dec26, _dec27, _dec28, _class, _class2, _descriptor, _descriptor2, _descriptor3, _descriptor4, _descriptor5, _descriptor6, _descriptor7, _descriptor8, _descriptor9, _descriptor10, _descriptor11, _descriptor12, _descriptor13, _descriptor14, _descriptor15, _descriptor16, _descriptor17, _descriptor18, _descriptor19, _descriptor20, _descriptor21, _descriptor22, _descriptor23, _descriptor24, _descriptor25, _descriptor26, _descriptor27, _descriptor28, _descriptor29, _descriptor30, _crd, ccclass, property, ThrowMergeGame;

  function _initializerDefineProperty(target, property, descriptor, context) { if (!descriptor) return; Object.defineProperty(target, property, { enumerable: descriptor.enumerable, configurable: descriptor.configurable, writable: descriptor.writable, value: descriptor.initializer ? descriptor.initializer.call(context) : void 0 }); }

  function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) { var desc = {}; Object.keys(descriptor).forEach(function (key) { desc[key] = descriptor[key]; }); desc.enumerable = !!desc.enumerable; desc.configurable = !!desc.configurable; if ('value' in desc || desc.initializer) { desc.writable = true; } desc = decorators.slice().reverse().reduce(function (desc, decorator) { return decorator(target, property, desc) || desc; }, desc); if (context && desc.initializer !== void 0) { desc.value = desc.initializer ? desc.initializer.call(context) : void 0; desc.initializer = undefined; } if (desc.initializer === void 0) { Object.defineProperty(target, property, desc); desc = null; } return desc; }

  function _initializerWarningHelper(descriptor, context) { throw new Error('Decorating class property failed. Please ensure that ' + 'transform-class-properties is enabled and runs after the decorators transform.'); }

  function _reportPossibleCrUseOfEgg(extras) {
    _reporterNs.report("Egg", "./Egg", _context.meta, extras);
  }

  function _reportPossibleCrUseOfEggDatabase(extras) {
    _reporterNs.report("EggDatabase", "./EggDatabase", _context.meta, extras);
  }

  function _reportPossibleCrUseOfLauncher(extras) {
    _reporterNs.report("Launcher", "./Launcher", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGameManager(extras) {
    _reporterNs.report("GameManager", "./GameManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfGlobalAudioManager(extras) {
    _reporterNs.report("GlobalAudioManager", "./GlobalAudioManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfAudioContent(extras) {
    _reporterNs.report("AudioContent", "./AudioContent", _context.meta, extras);
  }

  function _reportPossibleCrUseOfMergeEffect(extras) {
    _reporterNs.report("MergeEffect", "./MergeEffect", _context.meta, extras);
  }

  function _reportPossibleCrUseOfThemeManager(extras) {
    _reporterNs.report("ThemeManager", "./ThemeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfTHEME_CHANGED(extras) {
    _reporterNs.report("THEME_CHANGED", "./ThemeManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfRoundManager(extras) {
    _reporterNs.report("RoundManager", "./RoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfDESTROY_PIECES(extras) {
    _reporterNs.report("DESTROY_PIECES", "./RoundManager", _context.meta, extras);
  }

  function _reportPossibleCrUseOfCameraShake(extras) {
    _reporterNs.report("CameraShake", "./CameraShake", _context.meta, extras);
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
      Prefab = _cc.Prefab;
      instantiate = _cc.instantiate;
      Sprite = _cc.Sprite;
      Vec2 = _cc.Vec2;
      Vec3 = _cc.Vec3;
      PhysicsSystem2D = _cc.PhysicsSystem2D;
      tween = _cc.tween;
      Tween = _cc.Tween;
      director = _cc.director;
    }, function (_unresolved_2) {
      Egg = _unresolved_2.Egg;
    }, function (_unresolved_3) {
      EggDatabase = _unresolved_3.EggDatabase;
    }, function (_unresolved_4) {
      Launcher = _unresolved_4.Launcher;
    }, function (_unresolved_5) {
      GameManager = _unresolved_5.GameManager;
    }, function (_unresolved_6) {
      GlobalAudioManager = _unresolved_6.GlobalAudioManager;
    }, function (_unresolved_7) {
      AudioContent = _unresolved_7.AudioContent;
    }, function (_unresolved_8) {
      MergeEffect = _unresolved_8.MergeEffect;
    }, function (_unresolved_9) {
      ThemeManager = _unresolved_9.ThemeManager;
      THEME_CHANGED = _unresolved_9.THEME_CHANGED;
    }, function (_unresolved_10) {
      RoundManager = _unresolved_10.RoundManager;
      DESTROY_PIECES = _unresolved_10.DESTROY_PIECES;
    }, function (_unresolved_11) {
      CameraShake = _unresolved_11.CameraShake;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "8e385yFbxpKDogFzgF49gTA", "ThrowMergeGame", undefined);

      __checkObsolete__(['_decorator', 'Component', 'Node', 'Prefab', 'instantiate', 'Sprite', 'SpriteFrame', 'Vec2', 'Vec3', 'PhysicsSystem2D', 'tween', 'Tween', 'director']);

      ({
        ccclass,
        property
      } = _decorator);

      _export("ThrowMergeGame", ThrowMergeGame = (_dec = ccclass('ThrowMergeGame'), _dec2 = property(_crd && EggDatabase === void 0 ? (_reportPossibleCrUseOfEggDatabase({
        error: Error()
      }), EggDatabase) : EggDatabase), _dec3 = property(_crd && Launcher === void 0 ? (_reportPossibleCrUseOfLauncher({
        error: Error()
      }), Launcher) : Launcher), _dec4 = property(Node), _dec5 = property(_crd && GameManager === void 0 ? (_reportPossibleCrUseOfGameManager({
        error: Error()
      }), GameManager) : GameManager), _dec6 = property(_crd && ThemeManager === void 0 ? (_reportPossibleCrUseOfThemeManager({
        error: Error()
      }), ThemeManager) : ThemeManager), _dec7 = property(_crd && RoundManager === void 0 ? (_reportPossibleCrUseOfRoundManager({
        error: Error()
      }), RoundManager) : RoundManager), _dec8 = property(Sprite), _dec9 = property(Prefab), _dec10 = property({
        type: Node,
        tooltip: 'Layer for merge FX, rendered above the eggs. Falls back to Eggs container.'
      }), _dec11 = property(Node), _dec12 = property({
        tooltip: 'Lose-check only: speed below which a pile egg counts as settled. Higher = triggers loss while still drifting; lower = must be near-stopped.'
      }), _dec13 = property({
        tooltip: 'Passive drag while moving. Higher = slows/stops sooner (heavy); lower = glides longer. Fights launchSpeed for reach.'
      }), _dec14 = property({
        tooltip: 'Bounciness on impact (0-1). Higher = pings off walls/eggs; lower (~0) = dead stop on contact.'
      }), _dec15 = property({
        tooltip: 'Surface friction on glancing/sliding contact. Higher = scrubs speed along walls; keep low with Fixed Rotation.'
      }), _dec16 = property({
        tooltip: 'Mass per area = collision weight. Higher = shoves the pile harder, pushed less. Does NOT affect launch reach.'
      }), _dec17 = property({
        tooltip: 'Fraction of the two parents combined velocity the merged egg keeps. 0 = stops dead, 1 = full momentum.'
      }), _dec18 = property({
        tooltip: 'Seconds a freshly merged egg cannot merge again (lets its pop-in finish, avoids instant chain-merges).'
      }), _dec19 = property({
        tooltip: 'Pop-in start scale as a fraction of the authored scale when the next egg changes.'
      }), _dec20 = property({
        tooltip: 'Seconds for the next-egg pop-in animation.'
      }), _dec21 = property(Node), _dec22 = property(Node), _dec23 = property(Node), _dec24 = property(Node), _dec25 = property(Node), _dec26 = property(Node), _dec27 = property({
        tooltip: 'Min impact speed to play a hit/wall sound — filters gentle settling contacts.'
      }), _dec28 = property({
        tooltip: 'Min seconds between repeats of the same SFX (anti machine-gun).'
      }), _dec(_class = (_class2 = class ThrowMergeGame extends Component {
        constructor(...args) {
          super(...args);

          _initializerDefineProperty(this, "db", _descriptor, this);

          _initializerDefineProperty(this, "launcher", _descriptor2, this);

          _initializerDefineProperty(this, "eggsContainer", _descriptor3, this);

          _initializerDefineProperty(this, "gameManager", _descriptor4, this);

          _initializerDefineProperty(this, "themeManager", _descriptor5, this);

          _initializerDefineProperty(this, "roundManager", _descriptor6, this);

          /** The single Next Up egg (the one that will spawn next). Pulses + sits larger. */
          _initializerDefineProperty(this, "nextEggSprite", _descriptor7, this);

          // ── Merge effect ─────────────────────────────────────────────────────
          _initializerDefineProperty(this, "mergeEffectPrefab", _descriptor8, this);

          _initializerDefineProperty(this, "fxContainer", _descriptor9, this);

          // ── Lose line ────────────────────────────────────────────────────────
          _initializerDefineProperty(this, "loseLineNode", _descriptor10, this);

          _initializerDefineProperty(this, "loseLineYValue", _descriptor11, this);

          _initializerDefineProperty(this, "settleSpeed", _descriptor12, this);

          // ── Physics feel ─────────────────────────────────────────────────────
          _initializerDefineProperty(this, "linearDamping", _descriptor13, this);

          _initializerDefineProperty(this, "restitution", _descriptor14, this);

          _initializerDefineProperty(this, "friction", _descriptor15, this);

          _initializerDefineProperty(this, "density", _descriptor16, this);

          _initializerDefineProperty(this, "maxSpawnTier", _descriptor17, this);

          _initializerDefineProperty(this, "relaunchDelay", _descriptor18, this);

          _initializerDefineProperty(this, "mergeInertia", _descriptor19, this);

          _initializerDefineProperty(this, "mergeGrace", _descriptor20, this);

          // ── Next Up highlight ────────────────────────────────────────────────
          _initializerDefineProperty(this, "nextPopFrom", _descriptor21, this);

          _initializerDefineProperty(this, "nextPopDuration", _descriptor22, this);

          // ── Audio (each is a Node with an AudioContent) ──────────────────────
          _initializerDefineProperty(this, "throwAudio", _descriptor23, this);

          // egg launched
          _initializerDefineProperty(this, "wallAudio", _descriptor24, this);

          // egg hits table edge
          _initializerDefineProperty(this, "eggHitAudio", _descriptor25, this);

          // egg hits a non-mergeable egg
          _initializerDefineProperty(this, "mergeAudio", _descriptor26, this);

          // two eggs merge
          _initializerDefineProperty(this, "winAudio", _descriptor27, this);

          _initializerDefineProperty(this, "loseAudio", _descriptor28, this);

          _initializerDefineProperty(this, "hitSpeedThreshold", _descriptor29, this);

          _initializerDefineProperty(this, "sfxCooldown", _descriptor30, this);

          this._nextTier = 0;
          this._nextBaseScale = 1;
          this._dockedEgg = null;
          this._gameOver = false;
          this._pending = [];
          this._lastSfx = {};
        }

        onLoad() {
          PhysicsSystem2D.instance.enable = true;
          PhysicsSystem2D.instance.gravity = new Vec2(0, 0); // top-down table

          director.on(_crd && THEME_CHANGED === void 0 ? (_reportPossibleCrUseOfTHEME_CHANGED({
            error: Error()
          }), THEME_CHANGED) : THEME_CHANGED, this.reskinAll, this);
          director.on(_crd && DESTROY_PIECES === void 0 ? (_reportPossibleCrUseOfDESTROY_PIECES({
            error: Error()
          }), DESTROY_PIECES) : DESTROY_PIECES, this.onDestroyPieces, this);
        }

        onDestroy() {
          director.off(_crd && THEME_CHANGED === void 0 ? (_reportPossibleCrUseOfTHEME_CHANGED({
            error: Error()
          }), THEME_CHANGED) : THEME_CHANGED, this.reskinAll, this);
          director.off(_crd && DESTROY_PIECES === void 0 ? (_reportPossibleCrUseOfDESTROY_PIECES({
            error: Error()
          }), DESTROY_PIECES) : DESTROY_PIECES, this.onDestroyPieces, this);
        }

        start() {
          this._nextBaseScale = this.nextEggSprite ? this.nextEggSprite.node.scale.x : 1;
          this._nextTier = this.randomStartTier();
          this.updateNextDisplay();
          this.loadLauncher();
        }

        update(_dt) {
          if (this._gameOver) return;
          if (this._pending.length) this.processMerges();
          if (this._gameOver) return;
          this.sortEggDepth();
          const lineY = this.getLoseLineY();
          const kids = this.eggsContainer.children;

          for (let i = 0; i < kids.length; i++) {
            const egg = kids[i].getComponent(_crd && Egg === void 0 ? (_reportPossibleCrUseOfEgg({
              error: Error()
            }), Egg) : Egg);
            if (!egg || egg.consumed || egg === this._dockedEgg) continue;
            const y = egg.node.worldPosition.y;

            if (!egg.enteredField) {
              if (y > lineY) egg.enteredField = true;
              continue;
            }

            if (y <= lineY && egg.getSpeed() < this.settleSpeed) {
              this.triggerLose();
              break;
            }
          }
        }

        getLoseLineY() {
          return this.loseLineNode ? this.loseLineNode.worldPosition.y : this.loseLineYValue;
        }
        /** 2.5D depth sort: nearer (lower Y) eggs render on top. Keep ONLY eggs in this container. */


        sortEggDepth() {
          const sorted = this.eggsContainer.children.slice().sort((a, b) => b.worldPosition.y - a.worldPosition.y);

          for (let i = 0; i < sorted.length; i++) sorted[i].setSiblingIndex(i);
        }

        randomStartTier() {
          const max = Math.min(this.maxSpawnTier, this.db.count - 1);
          return Math.floor(Math.random() * (max + 1));
        }

        updateNextDisplay() {
          if (!this.nextEggSprite) return;
          const f = this.themeManager ? this.themeManager.tierIcon(this._nextTier) : null;
          if (f) this.nextEggSprite.spriteFrame = f;
          this.popNextEgg();
        }
        /** One-shot pop when the next egg changes — appears with a little punch. */


        popNextEgg() {
          const n = this.nextEggSprite.node;
          const base = this._nextBaseScale;
          Tween.stopAllByTarget(n);
          n.setScale(base * this.nextPopFrom, base * this.nextPopFrom, 1);
          tween(n).to(this.nextPopDuration, {
            scale: new Vec3(base, base, 1)
          }, {
            easing: 'backOut'
          }).start();
        }

        loadLauncher() {
          const tier = this._nextTier; // the shown next egg becomes the docked one

          this._nextTier = this.randomStartTier(); // roll a new next

          this.updateNextDisplay();
          const egg = this.spawnEgg(tier, this.launcher.node.worldPosition);
          if (!egg) return;
          this._dockedEgg = egg;
          this.launcher.loadEgg(egg, () => this.onShotFired());
        }

        onShotFired() {
          this._dockedEgg = null;
          this.playAudio(this.throwAudio); // egg launched

          this.scheduleOnce(() => {
            if (!this._gameOver) this.loadLauncher();
          }, this.relaunchDelay);
        }

        spawnEgg(tier, worldPos) {
          const def = this.db.getTier(tier);

          if (!def || !def.prefab) {
            console.warn(`[ThrowMergeGame] No prefab for tier ${tier}`);
            return null;
          }

          const node = instantiate(def.prefab);
          const egg = node.getComponent(_crd && Egg === void 0 ? (_reportPossibleCrUseOfEgg({
            error: Error()
          }), Egg) : Egg);
          egg.init({
            tier,
            linearDamping: this.linearDamping,
            restitution: this.restitution,
            friction: this.friction,
            density: this.density,
            contactCb: (a, b) => this.onContact(a, b)
          });
          this.eggsContainer.addChild(node);
          node.setWorldPosition(worldPos.x, worldPos.y, worldPos.z);
          if (this.themeManager) egg.setArt(this.themeManager.tierSprite(tier));
          return egg;
        }
        /** Runs inside the contact callback. Queue merges; play hit/wall SFX (gated). */


        onContact(a, b) {
          const speed = a.getSpeed();

          if (!b) {
            // wall
            if (speed > this.hitSpeedThreshold) this.playSfx(this.wallAudio, 'wall');
            return;
          }

          if (!a.mergeable || !b.mergeable) return; // docked egg — ignore

          if (a.tier === b.tier) {
            if (a.consumed || b.consumed) return;
            if (!a.canMerge || !b.canMerge) return; // a fresh merge is still in its grace window

            a.consumed = true;
            b.consumed = true;
            const va = a.getVelocity();
            const vb = b.getVelocity();

            this._pending.push({
              a,
              b,
              tier: a.tier,
              x: (a.node.worldPosition.x + b.node.worldPosition.x) / 2,
              y: (a.node.worldPosition.y + b.node.worldPosition.y) / 2,
              vx: (va.x + vb.x) / 2,
              vy: (va.y + vb.y) / 2
            });
          } else {
            // different tier — bounce
            if (speed > this.hitSpeedThreshold) this.playSfx(this.eggHitAudio, 'egghit');
          }
        }

        processMerges() {
          const list = this._pending;
          this._pending = [];

          for (const m of list) {
            if (m.a && m.a.node && m.a.node.isValid) m.a.node.destroy();
            if (m.b && m.b.node && m.b.node.isValid) m.b.node.destroy();
            this.playAudio(this.mergeAudio);
            const resultTier = Math.min(m.tier + 1, this.db.count - 1);
            this.spawnMergeFx(m.x, m.y, resultTier);

            if (m.tier >= this.db.count - 1) {
              var _this$roundManager;

              // two top-tier pieces collided — just burst again, nothing to spawn
              (_this$roundManager = this.roundManager) == null || _this$roundManager.dealBurst();
              continue;
            }

            const nextTier = m.tier + 1;
            const merged = this.spawnEgg(nextTier, new Vec3(m.x, m.y, 0));

            if (merged) {
              merged.setVelocity(new Vec2(m.vx * this.mergeInertia, m.vy * this.mergeInertia));
              merged.setMergeGrace(this.mergeGrace);
              const authored = merged.node.scale.clone();
              merged.node.setScale(authored.x * 0.2, authored.y * 0.2, authored.z);
              tween(merged.node).to(0.18, {
                scale: authored
              }, {
                easing: 'backOut'
              }).start();
            }

            if (nextTier >= this.db.count - 1) {
              var _this$roundManager2;

              // created the top tier: big burst to all monsters, then remove the piece
              (_this$roundManager2 = this.roundManager) == null || _this$roundManager2.dealBurst();

              if (merged) {
                const mn = merged;
                this.scheduleOnce(() => {
                  if (mn.node && mn.node.isValid) mn.node.destroy();
                }, 0.15);
              }
            } else {
              var _this$roundManager3;

              (_this$roundManager3 = this.roundManager) == null || _this$roundManager3.dealMergeDamage(nextTier);
            }
          }
        }

        spawnMergeFx(x, y, resultTier) {
          var _this$fxContainer, _TIER_COLORS$resultTi;

          if (!this.mergeEffectPrefab) return;
          const parent = (_this$fxContainer = this.fxContainer) != null ? _this$fxContainer : this.eggsContainer;
          const node = instantiate(this.mergeEffectPrefab);
          parent.addChild(node);
          node.setWorldPosition(x, y, 0);
          const fx = node.getComponent(_crd && MergeEffect === void 0 ? (_reportPossibleCrUseOfMergeEffect({
            error: Error()
          }), MergeEffect) : MergeEffect);
          if (fx) fx.play((_TIER_COLORS$resultTi = (_crd && MergeEffect === void 0 ? (_reportPossibleCrUseOfMergeEffect({
            error: Error()
          }), MergeEffect) : MergeEffect).TIER_COLORS[resultTier]) != null ? _TIER_COLORS$resultTi : (_crd && MergeEffect === void 0 ? (_reportPossibleCrUseOfMergeEffect({
            error: Error()
          }), MergeEffect) : MergeEffect).DEFAULT_COLORS);
        }

        triggerLose() {
          var _this$roundManager4;

          if (this._gameOver) return;
          this._gameOver = true;
          this.launcher.disable();
          (_this$roundManager4 = this.roundManager) == null || _this$roundManager4.stop();
          this.playAudio(this.loseAudio);
          this.scheduleOnce(() => this.gameManager.showEndCard(false), 0.6);
        }
        /** THEME_CHANGED handler: re-skin every piece in play (and the next preview) to the new theme. */


        reskinAll() {
          if (!this.themeManager) return;
          const kids = this.eggsContainer.children;

          for (let i = 0; i < kids.length; i++) {
            const egg = kids[i].getComponent(_crd && Egg === void 0 ? (_reportPossibleCrUseOfEgg({
              error: Error()
            }), Egg) : Egg);
            if (egg) egg.setArt(this.themeManager.tierSprite(egg.tier));
          }

          if (this._dockedEgg) this._dockedEgg.setArt(this.themeManager.tierSprite(this._dockedEgg.tier));
          const f = this.themeManager.tierIcon(this._nextTier);
          if (f && this.nextEggSprite) this.nextEggSprite.spriteFrame = f; // no pop on reskin
        }
        /** DESTROY_PIECES handler: a monster attacked — wipe `count` random in-play pieces. */


        onDestroyPieces(count) {
          var _instance;

          const pool = [];
          const kids = this.eggsContainer.children;

          for (let i = 0; i < kids.length; i++) {
            const e = kids[i].getComponent(_crd && Egg === void 0 ? (_reportPossibleCrUseOfEgg({
              error: Error()
            }), Egg) : Egg);
            if (e && !e.consumed && e !== this._dockedEgg) pool.push(kids[i]);
          }

          let destroyed = 0;

          for (let k = 0; k < count && pool.length > 0; k++) {
            const idx = Math.floor(Math.random() * pool.length);
            const n = pool.splice(idx, 1)[0];

            if (n && n.isValid) {
              const e = n.getComponent(_crd && Egg === void 0 ? (_reportPossibleCrUseOfEgg({
                error: Error()
              }), Egg) : Egg);
              if (e) e.consumed = true; // keep it out of merge checks before it dies

              this.spawnMergeFx(n.worldPosition.x, n.worldPosition.y, 0);
              n.destroy();
              destroyed++;
            }
          }

          if (destroyed > 0) (_instance = (_crd && CameraShake === void 0 ? (_reportPossibleCrUseOfCameraShake({
            error: Error()
          }), CameraShake) : CameraShake).instance) == null || _instance.shake(12, 0.18);
        }
        /** Cooldown-gated one-shot to avoid duplicate/rapid-fire contact sounds. */


        playSfx(n, key) {
          var _this$_lastSfx$key;

          const now = Date.now() / 1000;
          const last = (_this$_lastSfx$key = this._lastSfx[key]) != null ? _this$_lastSfx$key : 0;
          if (now - last < this.sfxCooldown) return;
          this._lastSfx[key] = now;
          this.playAudio(n);
        }

        playAudio(n) {
          if (!n || !(_crd && GlobalAudioManager === void 0 ? (_reportPossibleCrUseOfGlobalAudioManager({
            error: Error()
          }), GlobalAudioManager) : GlobalAudioManager).instance) return;
          const ac = n.getComponent(_crd && AudioContent === void 0 ? (_reportPossibleCrUseOfAudioContent({
            error: Error()
          }), AudioContent) : AudioContent);
          if (ac) (_crd && GlobalAudioManager === void 0 ? (_reportPossibleCrUseOfGlobalAudioManager({
            error: Error()
          }), GlobalAudioManager) : GlobalAudioManager).instance.playOneShot(ac);
        }

      }, (_descriptor = _applyDecoratedDescriptor(_class2.prototype, "db", [_dec2], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor2 = _applyDecoratedDescriptor(_class2.prototype, "launcher", [_dec3], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor3 = _applyDecoratedDescriptor(_class2.prototype, "eggsContainer", [_dec4], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor4 = _applyDecoratedDescriptor(_class2.prototype, "gameManager", [_dec5], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor5 = _applyDecoratedDescriptor(_class2.prototype, "themeManager", [_dec6], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor6 = _applyDecoratedDescriptor(_class2.prototype, "roundManager", [_dec7], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor7 = _applyDecoratedDescriptor(_class2.prototype, "nextEggSprite", [_dec8], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor8 = _applyDecoratedDescriptor(_class2.prototype, "mergeEffectPrefab", [_dec9], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor9 = _applyDecoratedDescriptor(_class2.prototype, "fxContainer", [_dec10], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor10 = _applyDecoratedDescriptor(_class2.prototype, "loseLineNode", [_dec11], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor11 = _applyDecoratedDescriptor(_class2.prototype, "loseLineYValue", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0;
        }
      }), _descriptor12 = _applyDecoratedDescriptor(_class2.prototype, "settleSpeed", [_dec12], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 12;
        }
      }), _descriptor13 = _applyDecoratedDescriptor(_class2.prototype, "linearDamping", [_dec13], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.6;
        }
      }), _descriptor14 = _applyDecoratedDescriptor(_class2.prototype, "restitution", [_dec14], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.45;
        }
      }), _descriptor15 = _applyDecoratedDescriptor(_class2.prototype, "friction", [_dec15], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.15;
        }
      }), _descriptor16 = _applyDecoratedDescriptor(_class2.prototype, "density", [_dec16], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 1.0;
        }
      }), _descriptor17 = _applyDecoratedDescriptor(_class2.prototype, "maxSpawnTier", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 2;
        }
      }), _descriptor18 = _applyDecoratedDescriptor(_class2.prototype, "relaunchDelay", [property], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.35;
        }
      }), _descriptor19 = _applyDecoratedDescriptor(_class2.prototype, "mergeInertia", [_dec17], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.5;
        }
      }), _descriptor20 = _applyDecoratedDescriptor(_class2.prototype, "mergeGrace", [_dec18], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.2;
        }
      }), _descriptor21 = _applyDecoratedDescriptor(_class2.prototype, "nextPopFrom", [_dec19], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.4;
        }
      }), _descriptor22 = _applyDecoratedDescriptor(_class2.prototype, "nextPopDuration", [_dec20], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.25;
        }
      }), _descriptor23 = _applyDecoratedDescriptor(_class2.prototype, "throwAudio", [_dec21], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor24 = _applyDecoratedDescriptor(_class2.prototype, "wallAudio", [_dec22], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor25 = _applyDecoratedDescriptor(_class2.prototype, "eggHitAudio", [_dec23], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor26 = _applyDecoratedDescriptor(_class2.prototype, "mergeAudio", [_dec24], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor27 = _applyDecoratedDescriptor(_class2.prototype, "winAudio", [_dec25], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor28 = _applyDecoratedDescriptor(_class2.prototype, "loseAudio", [_dec26], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return null;
        }
      }), _descriptor29 = _applyDecoratedDescriptor(_class2.prototype, "hitSpeedThreshold", [_dec27], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 5;
        }
      }), _descriptor30 = _applyDecoratedDescriptor(_class2.prototype, "sfxCooldown", [_dec28], {
        configurable: true,
        enumerable: true,
        writable: true,
        initializer: function () {
          return 0.06;
        }
      })), _class2)) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=72a40eaa15de2d1fc1aec2acc75ca238396b08d6.js.map