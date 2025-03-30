(() => {
  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.altKey && event.key.toUpperCase() === "P") {
      console.log("clikcing working hai ta");
      // Send a message to the background script
      chrome.runtime.sendMessage({ action: "togglePause" });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "DISABLE_SCROLL" && message.site !== "FACEBOOK") {
      if (!message.value) {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
      return true;
    } else if (message.action === "togglePause") {
      findMediaElement(); // Ensure we have the latest media element
      const isPaused = message.isPaused;
      toggleMediaPlayback(isPaused); // Pause or play the media
    }
    sendResponse({ status: "everything ok" });
    return true;
  });

  let mediaElement = null;

  // Find the media element (audio/video) on the page
  function findMediaElement() {
    // Look for the first audio or video element
    mediaElement = document.querySelector("audio, video");
  }

  // Pause or play the media element
  function toggleMediaPlayback(isPaused) {
    if (mediaElement) {
      if (isPaused) {
        mediaElement.pause(); // Pause if paused
      } else {
        mediaElement.play(); // Play if not paused
      }
    }
  }
})();
