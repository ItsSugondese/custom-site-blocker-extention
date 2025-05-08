(() => {
  var interval;
  var messageBox;

  document.addEventListener("keydown", function (event) {
    if (event.ctrlKey && event.altKey && event.key.toUpperCase() === "P") {
      console.log("clikcing working hai ta");
      // Send a message to the background script
      chrome.runtime.sendMessage({ action: "togglePause" });
    }
  });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (
      message.action === "DISABLE_SCROLL" &&
      message.site !== "FACEBOOK" &&
      message.site !== "INSTAGRAM"
    ) {
      // if (!message.value) {
      //   document.body.style.overflow = "auto";
      //   document.documentElement.style.overflow = "auto";
      // } else {
      //   document.body.style.overflow = "hidden";
      //   document.documentElement.style.overflow = "hidden";
      // }
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
        document.getElementById("sf_url").value = message.downloadUrl;
        document.getElementById("sf_submit").click();

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
      sendResponse({
        type: "download",
        isCompleted: true,
        status: "everything ok",
      });
      return true;
    } else if (message.action === "disturbToggle") {
      console.log("is in contnet");
      if (message.value) {
        if (!messageBox) {
          // messageBox = document.querySelector('div[role="textbox"]');
          messageBox = document.querySelector('span[data-slate-string="true"]');
        }
        interval = setInterval(() => {
          // Focus the message box (important)
          // Set the text content
          messageBox.innerHTML = "good luck for finals";

          messageBox.focus();
          // Fire input event so Discord detects change
          messageBox.dispatchEvent(new InputEvent("input", { bubbles: true }));

          // Press Enter to send the message
          const enterEvent = new KeyboardEvent("keydown", {
            bubbles: true,
            cancelable: true,
            key: "Enter",
            code: "Enter",
            keyCode: 13,
            which: 13,
          });

          messageBox.dispatchEvent(enterEvent);
        }, 2000); // every 2 seconds
      } else {
        clearInterval(interval);
      }
    }
    sendResponse({
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

function waitForElement(selector, timeout = 30000) {
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
