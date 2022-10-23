// Open the assets landing page before running this script
//   https://contenthub-staging.mecca.com/en-us/Assets
// Sorting: Date modified - ascending (oldest to latest)
// Filter: 
//   Asset media: Images; Vectors
// To execute, type in console: runAutomation({total_number_of_assets}, {number_of_seconds_before_start})
//   Example: initAutomation(29653, 5)
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

function clickLoginWithOkta() {
  console.log("clickLoginWithOkta()");
  var btn = document.getElementById('SAML');
  if (btn) {
    btn.click();
  }
}

function submitSignInOkta() {
  console.log("submitSignInOkta()");
  var btn = document.getElementById('okta-signin-submit');
  if (btn) {
    btn.click();
  }
}

function submit() {
  console.log("clickRefreshRenditions()");
  // For testing: 
  // var btn = document.querySelector('[data-bind="click: cancel, text: messages.cancel"]');
  var btn = document.getElementsByClassName('btn-primary');
  if (btn && btn.length > 0) {
    btn[0].click();
  }
}

function isAssetsLandingPage() {
  return window.location.pathname == "/en-us/Assets";
}

function isRefreshRenditionsPage() {
  return window.location.pathname.startsWith("/en-us/massedit/refreshrenditions");
}

function isLoginPage() {
  return window.location.pathname == "/en-us/Account";
}

function isLoginOktaPage() {
  return window.location.pathname == "/login/login.htm";
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

  // if session times out and redirects to login
  if (isLoginPage()) {
    setTimeout(() => {
      clickLoginWithOkta()();
    }, startsInMilliseconds);
  }

  if (isLoginOktaPage()) {
    setTimeout(() => {
      submitSignInOkta()();
    }, startsInMilliseconds);
  }
}

var keyTotalAssets = "ch-refresh-renditions-total-assets";
var keyCounter = "ch-refresh-renditions-counter";
var keyStartsInSeconds = "ch-refresh-renditions-starts-in-seconds";

function runAutomation(totalAssets, startsInSeconds) {
  var totalExecution = Math.ceil(totalAssets / 2000) + 1; // add extra 1

  if (!startsInSeconds) {
    startsInSeconds = 1;
  }

  sessionStorage.setItem(keyTotalAssets, totalAssets);
  sessionStorage.setItem(keyStartsInSeconds, startsInSeconds);

  var counter = sessionStorage.getItem(keyCounter);
  console.log("Total Execution: " + totalExecution + "; Executed: " + counter + ";");

  if (counter) {
    if (counter < totalExecution) {
      if (isAssetsLandingPage()) {
        setTimeout(() => {
          executeRefreshRenditions(startsInSeconds);
        }, 1800000); // set to 30 mins each execution (1800000 milliseconds)
      } 
	  else {
        executeRefreshRenditions(startsInSeconds);

        if (isRefreshRenditionsPage()) {
          sessionStorage.setItem(keyCounter, Number(counter) + 1);
        }
      }
    } 
	else {
      console.log("Execution completed!");
    }
  } 
  else { // initial execution
    if (isAssetsLandingPage()) {
      console.log("Initial execution...");
      sessionStorage.setItem(keyCounter, 0);
      executeRefreshRenditions(startsInSeconds);
    }
  }
}

window.addEventListener('load', function(event) {
  var totalAssets = sessionStorage.getItem(keyTotalAssets);
  var startsInSeconds = sessionStorage.getItem(keyStartsInSeconds);

  if (totalAssets > 0) {
    runAutomation(totalAssets, startsInSeconds);
  }
});

function initAutomation(totalAssets, startsInSeconds) {
  sessionStorage.removeItem(keyTotalAssets);
  sessionStorage.removeItem(keyCounter);
  sessionStorage.removeItem(keyStartsInSeconds);
  runAutomation(totalAssets, startsInSeconds);
}
