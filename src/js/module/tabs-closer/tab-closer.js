$(function () {
  document.getElementById("closeAllTabButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "closeAllTab",
    });
  });
});
