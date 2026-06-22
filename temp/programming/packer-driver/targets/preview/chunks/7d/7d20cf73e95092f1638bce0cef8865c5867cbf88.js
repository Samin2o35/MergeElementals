System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, GenericAdAdapter, MRAIDAdAdapter, MetaAdAdapter, MintegralAdAdapter, AdManager, _crd, AdEvent, AdState;

  _export({
    GenericAdAdapter: void 0,
    MRAIDAdAdapter: void 0,
    MetaAdAdapter: void 0,
    MintegralAdAdapter: void 0,
    AdManager: void 0
  });

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "24a59ZNJIxCxZkPf7dhtPq1", "AdManager", undefined); // -------------------------
      // Global Window Types
      // -------------------------


      // -------------------------
      // Common Event Enum
      // -------------------------
      _export("AdEvent", AdEvent = /*#__PURE__*/function (AdEvent) {
        AdEvent["READY"] = "READY";
        AdEvent["START"] = "START";
        AdEvent["AUDIO_CHANGE"] = "AUDIO_CHANGE";
        AdEvent["STATE_CHANGE"] = "STATE_CHANGE";
        AdEvent["VIEWABLE_CHANGE"] = "VIEWABLE_CHANGE";
        AdEvent["CLICK"] = "CLICK";
        AdEvent["EXPAND"] = "EXPAND";
        AdEvent["CLOSE"] = "CLOSE";
        AdEvent["RETRY"] = "RETRY";
        AdEvent["ERROR"] = "ERROR";
        AdEvent["IMPRESSION"] = "IMPRESSION";
        AdEvent["COMPLETED"] = "COMPLETED";
        AdEvent["VIDEO_START"] = "VIDEO_START";
        AdEvent["VIDEO_COMPLETE"] = "VIDEO_COMPLETE";
        AdEvent["REWARD"] = "REWARD";
        return AdEvent;
      }({}));

      _export("AdState", AdState = /*#__PURE__*/function (AdState) {
        AdState["LOADING"] = "LOADING";
        AdState["DEFAULT"] = "DEFAULT";
        AdState["EXPANDED"] = "EXPANDED";
        AdState["RESIZED"] = "RESIZED";
        AdState["HIDDEN"] = "HIDDEN";
        return AdState;
      }({}));

      // -----------------------------------------
      // Generic Adapter
      // -----------------------------------------
      _export("GenericAdAdapter", GenericAdAdapter = class GenericAdAdapter {
        constructor() {
          this.m_state = AdState.LOADING;
        }

        SetUpGlobalMethods() {
          if (!window.adManOpenStore) {
            window.adManOpenStore = url => {
              console.log("[GenericAdapter] window.adManOpenStore() called! Delegating to window.open()");
              window.open(url);
            };
          }

          if (!window.adManGameReady) {
            window.adManGameReady = () => {
              console.log("[GenericAdapter] window.adManGameReady() called!");
            };
          }

          if (!window.adManGameEnd) {
            window.adManGameEnd = () => {
              console.log("[GenericAdapter] window.adManGameEnd() called!");
            };
          }

          if (!window.adManGameRetry) {
            window.adManGameRetry = () => {
              console.log("[GenericAdapter] window.adManGameRetry() called!");
            };
          }
        }

        HookEvents() {
          console.log("[GenericAdapter] No events to hook into!");
        }

        OpenStore(url) {
          AdManager.emit(AdEvent.CLICK);

          if (window.adManOpenStore) {
            console.log("[GenericAdapter] OpenStore() called! Delegating to window.adManOpenStore()");
            window.adManOpenStore(url);
          }
        }

        GameReady() {
          if (window.adManGameReady) {
            console.log("[GenericAdapter] GameReady() called! Delegating to window.adManGameReady()");
            this.m_state = AdState.DEFAULT;
            window.adManGameReady();
          }
        }

        GameEnd() {
          if (window.adManGameEnd) {
            console.log("[GenericAdapter] GameEnd() called! Delegating to window.adManGameEnd()");
            this.m_state = AdState.HIDDEN;
            window.adManGameEnd();
          }
        }

        GameRetry() {
          if (window.adManGameRetry) {
            console.log("[GenericAdapter] GameRetry() called! Delegating to window.adManGameRetry()");
            window.adManGameRetry();
          }
        }

        GetCurrentState() {
          return this.m_state;
        }

      }); // -------------------------
      // MRAID Adapter
      // -------------------------


      _export("MRAIDAdAdapter", MRAIDAdAdapter = class MRAIDAdAdapter {
        constructor() {
          this.m_state = AdState.LOADING;
        }

        SetUpGlobalMethods() {
          if (!window.adManOpenStore) {
            window.adManOpenStore = url => {
              console.log("[MRAIDAdapter] window.adManOpenStore() called! Delegating to window.mraid.open()");
              window.mraid.open(url);
            };
          }

          if (!window.adManGameReady) {
            window.adManGameReady = () => {
              console.log("[MRAIDAdapter] window.adManGameReady() called!");
            };
          }

          if (!window.adManGameEnd) {
            window.adManGameEnd = () => {
              console.log("[MRAIDAdapter] window.adManGameEnd() called!");
            };
          }

          if (!window.adManGameRetry) {
            window.adManGameRetry = () => {
              console.log("[MRAIDAdapter] window.adManGameRetry() called!");
            };
          }
        }

        HookEvents() {
          if (!window.mraid) return;
          console.log("[MRAIDAdapter] MRAID Found! Hooking MRAID Events");
          window.mraid.addEventListener('ready', this.onReadyEvent.bind(this));
          window.mraid.addEventListener('error', msg => AdManager.emit(AdEvent.ERROR, msg));
          window.mraid.addEventListener('stateChange', this.onStateChange.bind(this));
          window.mraid.addEventListener('audioVolumeChange', vol_percentage => AdManager.emit(AdEvent.AUDIO_CHANGE, vol_percentage));
        }

        OpenStore(url) {
          AdManager.emit(AdEvent.CLICK);

          if (window.adManOpenStore) {
            console.log("[MRAIDAdapter] OpenStore() called! Delegating to window.adManOpenStore()");
            window.adManOpenStore(url);
          }
        }

        GameReady() {
          if (window.adManGameReady) {
            console.log("[MRAIDAdapter] GameReady() called! Delegating to window.adManGameReady()");
            this.m_state = AdState.DEFAULT;
            window.adManGameReady();
          }
        }

        GameEnd() {
          if (window.adManGameEnd) {
            console.log("[MRAIDAdapter] GameEnd() called! Delegating to window.adManGameEnd()");
            this.m_state = AdState.HIDDEN;
            window.adManGameEnd();
          }
        }

        GameRetry() {
          if (window.adManGameRetry) {
            console.log("[MRAIDAdapter] GameRetry() called! Delegating to window.adManGameRetry()");
            window.adManGameRetry();
          }
        }

        GetCurrentState() {
          return this.m_state;
        }

        onReadyEvent() {
          AdManager.emit(AdEvent.READY);
          AdManager.emit(AdEvent.START);
        }

        onStateChange(state) {
          AdManager.emit(AdEvent.STATE_CHANGE);

          switch (state) {
            case 'loading':
              this.m_state = AdState.LOADING;
              break;

            case 'default':
              this.m_state = AdState.DEFAULT;
              break;

            case 'expanded':
              this.m_state = AdState.EXPANDED;
              break;

            case 'resized':
              this.m_state = AdState.RESIZED;
              break;

            case 'hidden':
              this.m_state = AdState.HIDDEN;
              break;
          }

          ;
        }

      }); // -------------------------
      // Meta Adapter
      // -------------------------


      _export("MetaAdAdapter", MetaAdAdapter = class MetaAdAdapter {
        constructor() {
          this.m_state = AdState.LOADING;
        }

        SetUpGlobalMethods() {
          if (!window.adManOpenStore) {
            window.adManOpenStore = url => {
              console.log("[MetaAdapter] window.adManOpenStore() called! Delegating to window.FbPlayableAd.onCTAClick()");
              window.FbPlayableAd.onCTAClick();
            };
          }

          if (!window.adManGameReady) {
            window.adManGameReady = () => {
              console.log("[MetaAdapter] window.adManGameReady() called!");
            };
          }

          if (!window.adManGameEnd) {
            window.adManGameEnd = () => {
              console.log("[MetaAdapter] window.adManGameEnd() called!");
            };
          }

          if (!window.adManGameRetry) {
            window.adManGameRetry = () => {
              console.log("[MetaAdapter] window.adManGameRetry() called!");
            };
          }
        }

        HookEvents() {
          if (!window.FbPlayableAd) return;
          console.log("Meta / Moloco Playable API found! Hooking Events");
          window.FbPlayableAd.onFinish == null || window.FbPlayableAd.onFinish(this.GameEnd.bind(this));
          window.FbPlayableAd.onError == null || window.FbPlayableAd.onError(e => AdManager.emit(AdEvent.ERROR, e));
        }

        OpenStore(url) {
          AdManager.emit(AdEvent.CLICK);

          if (window.adManOpenStore) {
            console.log("[MetaAdapter] OpenStore() called! Delegating to window.adManOpenStore()");
            window.adManOpenStore(url);
          }
        }

        GameReady() {
          if (window.adManGameReady) {
            console.log("[MetaAdapter] GameReady() called! Delegating to window.adManGameReady()");
            this.m_state = AdState.DEFAULT;
            window.adManGameReady();
          }
        }

        GameEnd() {
          if (window.adManGameEnd) {
            console.log("[MetaAdapter] GameEnd() called! Delegating to window.adManGameEnd()");
            this.m_state = AdState.HIDDEN;
            window.adManGameEnd();
          }
        }

        GameRetry() {
          if (window.adManGameRetry) {
            console.log("[MetaAdapter] GameRetry() called! Delegating to window.adManGameRetry()");
            window.adManGameRetry();
          }
        }

        GetCurrentState() {
          return this.m_state;
        }

      }); // ---------------------------------
      // Mintegral Adapter
      // ---------------------------------


      _export("MintegralAdAdapter", MintegralAdAdapter = class MintegralAdAdapter {
        constructor() {
          this.m_state = AdState.LOADING;
        }

        SetUpGlobalMethods() {
          if (!window.adManOpenStore) {
            window.adManOpenStore = url => {
              console.log("[MintegralAdapter] window.adManOpenStore() called! Delegating to window.install()");
              window.install();
            };
          }

          if (!window.adManGameReady) {
            window.adManGameReady = () => {
              console.log("[MintegralAdapter] window.adManGameReady() called! Delegating to window.gameReady()");
              window.gameReady();
            };
          }

          if (!window.adManGameEnd) {
            window.adManGameEnd = () => {
              console.log("[MintegralAdapter] window.adManGameEnd() called! Delegating to window.gameEnd()");
              window.gameEnd();
            };
          }

          if (!window.adManGameRetry) {
            window.adManGameRetry = () => {
              console.log("[MintegralAdapter] window.adManGameRetry() called! Delegating to window.gameRetry()");
              window.gameRetry();
            };
          }

          if (!window.gameStart) {
            window.gameStart = () => {
              AdManager.emit(AdEvent.START);
            };
          }

          if (!window.gameClose) {
            window.gameClose = () => {
              AdManager.emit(AdEvent.CLOSE);
            };
          }
        }

        HookEvents() {
          console.log("[MintegralAdapter] No events to hook into!");
        }

        OpenStore(url) {
          AdManager.emit(AdEvent.CLICK);

          if (window.adManOpenStore) {
            console.log("[MintegralAdapter] OpenStore() called! Delegating to window.adManOpenStore()");
            window.adManOpenStore(url);
          }
        }

        GameReady() {
          if (window.adManGameReady) {
            console.log("[MintegralAdapter] GameReady() called! Delegating to window.adManGameReady()");
            this.m_state = AdState.DEFAULT;
            window.adManGameReady();
          }
        }

        GameEnd() {
          if (window.adManGameEnd) {
            console.log("[MintegralAdapter] GameEnd() called! Delegating to window.adManGameEnd()");
            this.m_state = AdState.HIDDEN;
            window.adManGameEnd();
          }
        }

        GameRetry() {
          if (window.adManGameRetry) {
            console.log("[MintegralAdapter] GameRetry() called! Delegating to window.adManGameRetry()");
            window.adManGameRetry();
          }
        }

        GetCurrentState() {
          return this.m_state;
        }

      }); // -------------------------
      // AdManager
      // -------------------------


      _export("AdManager", AdManager = class AdManager {
        constructor() {
          if (window.mraid) AdManager.s_adAdapter = new MRAIDAdAdapter();else if (window.FbPlayableAd) AdManager.s_adAdapter = new MetaAdAdapter();else if (window.gameReady && window.gameEnd && window.gameRetry && window.install) AdManager.s_adAdapter = new MintegralAdAdapter();else AdManager.s_adAdapter = new GenericAdAdapter();

          if (AdManager.s_adAdapter) {
            AdManager.s_adAdapter.SetUpGlobalMethods();
            AdManager.s_adAdapter.HookEvents();
          }
        }

        static on(event, callback) {
          if (!this.s_handlers.has(event)) this.s_handlers.set(event, []);
          this.s_handlers.get(event).push(callback);
        }

        static off(event, callback) {
          var callbacks = this.s_handlers.get(event);
          if (!callbacks) return;
          var index = callbacks.indexOf(callback);
          if (index !== -1) callbacks.splice(index, 1);
        }

        static emit(event, data) {
          var callbacks = this.s_handlers.get(event);
          if (!callbacks) return;
          callbacks.forEach(fn => fn(data));
        }

        static openStore(url) {
          this.s_adAdapter.OpenStore(url);
        }

        static gameReady() {
          this.s_adAdapter.GameReady();
        }

        static gameEnd() {
          this.s_adAdapter.GameEnd();
        }

        static gameRetry() {
          this.s_adAdapter.GameRetry();
        }

        static getAdAdapter() {
          return this.s_adAdapter;
        }

      });

      AdManager.s_handlers = new Map();
      AdManager.s_adAdapter = null;
      new AdManager();

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=7d20cf73e95092f1638bce0cef8865c5867cbf88.js.map