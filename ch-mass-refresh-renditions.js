// Open the assets landing page before running this script
//   https://contenthub-staging.mecca.com/en-us/Assets
// Sorting: Date modified - ascending (oldest to latest)
// Filter: 
//   Asset media: Images; Vectors
// To initiatlize execution, type in console: initAutomation({total_number_of_assets})
//   Example: initAutomation(29653)
// To continue interrupted execution, type in console: contAutomation()

// Adjust these variables if needed:
var minutesEachExecution = 20; // Minutes of execution per batch
var secondsToStart = 10; // Seconds to start when page loads
var isTestingOnly = false; // If testing only, 'Cancel' will be clicked instead of 'Submit'

// Constant for Content Hub:
var assetsPerExecution = 2000; // Maximum assets per execution, constant of 2000 assets for CH

// Session Storage
var keyTotalAssets = "ch-refresh-renditions-total-assets";
var keyCounter = "ch-refresh-renditions-counter";
var keyStartExecution = "ch-refresh-renditions-start-execution-for-current-branch";

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
  else {
    console.log("Session expired. Refreshing the page...");
    location.reload();
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

  var btn = document.getElementsByClassName('btn-primary');

  if (isTestingOnly) { // use 'Cancel' button for testing
    btn = document.querySelectorAll('[data-bind="click: cancel, text: messages.cancel"]');
  }

  if (btn && btn.length > 0) {
    btn[0].click();
  }

  // increment counter
  var counter = sessionStorage.getItem(keyCounter);
  sessionStorage.setItem(keyCounter, Number(counter) + 1);
  
  // set execution start date time
  sessionStorage.setItem(keyStartExecution, Date.now());
}

function isAssetsLandingPage() {
  return window.location.pathname.toLowerCase() == "/en-us/assets";
}

function isRefreshRenditionsPage() {
  return window.location.pathname.toLowerCase().startsWith("/en-us/massedit/refreshrenditions");
}

function isLoginPage() {
  return window.location.pathname.toLowerCase() == "/en-us/account";
}

function isLoginOktaPage() {
  return window.location.pathname.toLowerCase() == "/login/login.htm";
}

function executeUIProcess() {
  var millisecondsToStart = secondsToStart * 1000;

  // assets page
  if (isAssetsLandingPage()) {
    setTimeout(() => {
      clearSelection();
    }, millisecondsToStart);

    setTimeout(() => {
      refreshAssetsSelection();
    }, millisecondsToStart + 5000);

    setTimeout(() => {
      refreshAssetsSelection(); // re-execute refresh
    }, millisecondsToStart + 10000);

    setTimeout(() => {
      selectAllAssets();
    }, millisecondsToStart + 15000);

    setTimeout(() => {
      openEllipsisDropdown();
    }, millisecondsToStart + 20000);

    setTimeout(() => {
      clickRefreshRenditions();
    }, millisecondsToStart + 22000);
  }

  // redirects to refresh renditions page
  if (isRefreshRenditionsPage()) {
    setTimeout(() => {
      untoggleRefreshFailedOnly();
    }, millisecondsToStart);

    setTimeout(() => {
      submit();
    }, millisecondsToStart + 5000);
  }

  // if session times out and redirects to login
  if (isLoginPage()) {
    setTimeout(() => {
      clickLoginWithOkta();
    }, millisecondsToStart);
  }

  if (isLoginOktaPage()) {
    setTimeout(() => {
      submitSignInOkta();
    }, millisecondsToStart);
  }
}

function initAutomation(totalAssets) {
  console.log("Initialize...");
  sessionStorage.setItem(keyTotalAssets, totalAssets);
  sessionStorage.setItem(keyCounter, 0);
  sessionStorage.setItem(keyStartExecution, '');
  executeUIProcess();
  return true;
}

function contAutomation() {
  if (isLoginPage() || isLoginOktaPage()) {
    executeUIProcess();
    return true;
  }
  
  var totalAssets = sessionStorage.getItem(keyTotalAssets);
  var totalExecution = Math.ceil(totalAssets / assetsPerExecution) + 1; // add extra 1
  var counter = sessionStorage.getItem(keyCounter);

  if (counter) {
    console.log("Batches: " + totalExecution + "; Executed: " + counter + ";");

    if (counter < totalExecution) {
      if (isAssetsLandingPage()) {
        var startExecution = sessionStorage.getItem(keyStartExecution);
        if (startExecution) {
          var currDt = new Date(Date.now());
          var execDt = new Date(Number(startExecution));
          execDt.setMinutes(execDt.getMinutes() + minutesEachExecution); // projected execution completion

          if (currDt < execDt) {
            console.log("Remaining minute/s: " + ((execDt - currDt) / 1000 / 60) + " as of " + currDt.toLocaleTimeString());

            setTimeout(() => { // delay the execution to remaining time
              location.reload(); // refresh page before execution
            }, execDt - currDt);
          }
          else { // curent time is already ahead of projected execution completion
            executeUIProcess();
          }
        }
        else { // no value for start execution session yet
          executeUIProcess();
        }
      }
      else { // non assets landing page
        executeUIProcess();
      }
    }
    else { // overall completion
      console.log("Completed!");
      sessionStorage.removeItem(keyTotalAssets);
      sessionStorage.removeItem(keyCounter);
      sessionStorage.removeItem(keyStartExecution);
    }
  }
  else {
    console.log("Kindly execute 'init'.");
  }

  return true;
}

window.addEventListener('load', function(event) {
  contAutomation();
});
