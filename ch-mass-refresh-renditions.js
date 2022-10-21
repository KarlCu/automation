// Open the assets landing page before running this script
// 		https://contenthub-staging.mecca.com/en-us/Assets
// Sorting: Date modified - ascending (oldest to latest)
// Filter: 
//		Asset media: Images; Vectors
// To execute, type in console: runAutomation({total_number_of_assets}, {number_of_seconds_before_start})
//		Example: runAutomation(300, 2)
function clearSelection() {
  console.log("clearSelection()");
  var btn = document.querySelector('[data-testid="clear-selection"]');
  if (btn) {
    btn.click();
  }
}

function refreshAssetsSelection() {
  console.log("refreshAssetsSelection()");
  var btn = document.querySelector('[data-testid="refresh-search"]');
  if (btn) {
    btn.click();
  }
}

function selectAllAssets() {
  console.log("selectAllAssets()");
  var btn = document.querySelector('[data-testid="add-all-to-selection"]');
  if (btn) {
    btn.click();
  }
}

function openEllipsisDropdown() {
  console.log("openEllipsisDropdown()");
  var btn = document.querySelector('[data-testid="selection-operation-dropdown-button"]');
  if (btn) {
    btn.click();
  }
}

function clickRefreshRenditions() {
  console.log("clickRefreshRenditions()");
  var btn = document.querySelector('[data-testid="RefreshRenditions"]');
  if (btn) {
    btn.click();
  }
}

function untoggleRefreshFailedOnly() {
  console.log("untoggleRefreshFailedOnly()");
  var btn = document.getElementById('toggleRefreshFailedOnly');
  if (btn) {
    btn.click();
  }
}

function submit() {
  console.log("clickRefreshRenditions()");
  var btn = document.querySelector('[data-bind="click: cancel, text: messages.cancel"]');
  if (btn) {
    btn.click();
  }
}

function isAssetsLandingPage() {
  return window.location.pathname == "/en-us/Assets";
}

function isRefreshRenditionsPage() {
  return window.location.pathname.startsWith("/en-us/massedit/refreshrenditions");
}

function executeRefreshRenditions(startsInSeconds) {

  var startsInMilliseconds = startsInSeconds * 1000;

  // assets page
  if (isAssetsLandingPage()) {
    setTimeout(() => {
      clearSelection();
    }, startsInMilliseconds);

    setTimeout(() => {
      refreshAssetsSelection();
    }, startsInMilliseconds + 2000);

    setTimeout(() => {
      selectAllAssets();
    }, startsInMilliseconds + 8000);

    setTimeout(() => {
      openEllipsisDropdown();
    }, startsInMilliseconds + 14000);

    setTimeout(() => {
      clickRefreshRenditions();
    }, startsInMilliseconds + 16000);
  }

  // redirects to refresh renditions page
  if (isRefreshRenditionsPage()) {
    setTimeout(() => {
      untoggleRefreshFailedOnly();
    }, startsInMilliseconds);

    setTimeout(() => {
      submit();
    }, startsInMilliseconds + 2000);
  }
}

var keyTotalAssets = "ch-refresh-renditions-total-assets";
var keyCounter = "ch-refresh-renditions-counter";
var keyStartsInSeconds = "ch-refresh-renditions-starts-in-seconds";

var counter = sessionStorage.getItem(keyCounter);

function runAutomation(totalAssets, startsInSeconds) {
  var totalExecution = Math.ceil(totalAssets / 2000) + 1; // add extra 1

  if (!startsInSeconds) {
    startsInSeconds = 1;
  }

  sessionStorage.setItem(keyTotalAssets, totalAssets);
  sessionStorage.setItem(keyStartsInSeconds, startsInSeconds);

  if (counter) {
    if (counter < totalExecution) {
      if (isAssetsLandingPage()) {
        sessionStorage.setItem(keyCounter, counter + 1);
        setTimeout(() => {
          executeRefreshRenditions(startsInSeconds);
        }, 2000); // set to 30 mins each execution
      } else if (isRefreshRenditionsPage()) {
        executeRefreshRenditions(startsInSeconds);
      }
    }
  } else { // initial execution
    if (isAssetsLandingPage()) {
      sessionStorage.setItem(keyCounter, 0);
      executeRefreshRenditions(startsInSeconds);
    }
  }
}

window.addEventListener('load', function(event) {
  if (isAssetsLandingPage() || isRefreshRenditionsPage()) {
    var totalAssets = sessionStorage.getItem(keyTotalAssets);
    var startsInSeconds = sessionStorage.getItem(keyStartsInSeconds);

    if (totalAssets > 0 && counter > 0) {
      runAutomation(total, startsInSeconds);
    }
  }
});
