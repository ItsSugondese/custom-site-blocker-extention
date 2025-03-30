$(function () {
  document.getElementById("pauseButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "togglePause",
    });
  });

  document.getElementById("closeAllTabButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "closeAllTab",
    });
  });
});
