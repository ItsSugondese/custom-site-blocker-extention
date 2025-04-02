$(function () {
  document.getElementById("pauseButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "togglePause",
    });
  });
});
