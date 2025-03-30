$(function () {
  updateMedia();

  // Listen for real-time updates
  chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "mediaUpdated") {
      updateMedia(message.data);
    }
  });

  document.getElementById("pauseButton").addEventListener("click", () => {
    chrome.runtime.sendMessage({
      action: "togglePause",
      tabId: $("#tabId").val(),
    });
  });
});

function updateMedia(media) {
  if (media) {
    $("#title").text(media.title || "No Title"); // Set text for title
    $("#artist").text(media.artist || "Unknown Artist"); // Set text for artist
    $("#artwork").attr("src", media.artwork || "default.png"); // Set the src attribute for the image
    $("#tabId").attr("value", media.tabId); // Set the src attribute for the image
  }
}
