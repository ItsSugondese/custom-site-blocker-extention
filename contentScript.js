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
    } else if (message.action === "download") {
      if (message.downloadType === "MUSIC") {
        document.getElementById("query").value = message.downloadUrl;
        document.querySelector('input[type="submit"][value="Search"]').click();

        waitForElement("a.\\31")
          .then((link) => {
            link.click();
            waitForElement("a.completed")
              .then((completedLink) => {
                completedLink.click();
              })
              .catch(console.error);
          })
          .catch(console.error);
      } else {
        waitForElement('a.download-icon[data-quality="720"][data-type="mp4"]')
          .then((link) => {
            link.click();
            waitForElement("button.c-ui-download-button")
              .then((button) => {
                button.click();
              })
              .catch(console.error);
          })
          .catch(console.error);
      }
    }
    sendResponse({
      type: "download",
      isCompleted: true,
      status: "everything ok",
    });
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

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const observer = new MutationObserver(() => {
      const element = document.querySelector(selector);
      if (element) {
        observer.disconnect();
        resolve(element);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject(new Error("Element not found within timeout."));
    }, timeout);
  });
}
