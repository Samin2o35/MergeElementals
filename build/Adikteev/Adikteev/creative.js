(function () {

function getInjectionTarget() {
  return document.head || document.getElementsByTagName("head")[0] || document.documentElement || document.body;
}

    console.log("AK_CLICK_DESTINATION_URL initialized with: ", AK_CLICK_DESTINATION_URL);
    console.log("AK_CLICK_PIXEL_URL initialized with: ", AK_CLICK_PIXEL_URL);


    window.openStore = function (url) {
        console.log("Overwritten Adikteev openStore called!");
        
        try {
          if (AK_CLICK_PIXEL_URL && AK_CLICK_PIXEL_URL !== "PLACEHOLDER_CLICK_PIXEL") 
          {
              var img = new Image();
              img.src = AK_CLICK_PIXEL_URL;
          }
    
          if (AK_CLICK_DESTINATION_URL && AK_CLICK_DESTINATION_URL !== "PLACEHOLDER_CLICK_REDIRECT") 
          {
              if(typeof mraid !== 'undefined' && mraid.open)
              {
                console.log("mraid.open called with: ", AK_CLICK_DESTINATION_URL);

                mraid.open(AK_CLICK_DESTINATION_URL);
              }
              else
              {
                console.log("window.open called with: ", AK_CLICK_DESTINATION_URL);

                window.open(AK_CLICK_DESTINATION_URL);
              }
          }
          else
          {
              console.log("Falling back to pre determined redirect URL");
            
              const IOS_STORE_URL = "https://apps.apple.com/us/app/farmville-2-country-escape/id824318267";
              const ANDROID_STORE_URL = "https://play.google.com/store/apps/details?id=com.zynga.FarmVille2CountryEscape&pcampaignid=web_share";

              var isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || navigator.userAgent.includes("Macintosh");

              const clickTag = isIOS ? IOS_STORE_URL : ANDROID_STORE_URL;

              console.log("Clicktag initialized with: ", clickTag);

              if(typeof mraid !== 'undefined' && mraid.open)
              {
                console.log("mraid.open called with: ", clickTag);

                mraid.open(clickTag);
              }
              else
              {
                console.log("window.open called with: ", clickTag);

                window.open(clickTag);
              }
          }

        } catch (e) {
        console.error("Click handling failed:", e);
        }
    };


  // --- Cocos build files ---
  var files = [
    "./js/index0.js",
    "./js/index1.js",
    "./js/index2.js",
    "./js/index3.js",
    "./js/index4.js",
    "./js/index5.js",
    "./js/index6.js",
    "./js/index7.js"
  ];



      // --- Inject import map ---
  function injectImportMap() {
    var importMap = document.createElement("script");
    importMap.type = "systemjs-importmap";
    importMap.textContent = JSON.stringify({
      imports: {
        cc: "./../cocos-js/cc.js"
      }
    });
    getInjectionTarget().appendChild(importMap);
  }

  // --- Script loader (sequential, preserves order) ---
  function loadScriptSequentially(i, callback) {
    if (i >= files.length) {
      callback && callback();
      return;
    }
    var script = document.createElement("script");
    script.src = files[i];
    script.onload = function () {
      loadScriptSequentially(i + 1, callback);
    };
    script.onerror = function (e) {
      console.error("Failed to load:", files[i], e);
    };
    getInjectionTarget().appendChild(script);
  }

// --- Boot sequence ---
  function bootCocos() {
    injectImportMap(); // inject before scripts
    loadScriptSequentially(0, function () {
      console.log("✅ All cocos scripts loaded");
    });
  }

  // --- Wait for DOM ready if needed ---
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bootCocos);
  } else {
    bootCocos();
  }

})();
