(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "DISABLE_SCROLL" && message.site !== "FACEBOOK") {
      if (!message.value) {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
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

  // Listen for messages from background to toggle pause/resume

  function getMediaInfo() {
    return new Promise((resolve) => {
      if (navigator.mediaSession && navigator.mediaSession.metadata) {
        const media = navigator.mediaSession.metadata;
        const state = navigator.mediaSession.playbackState;

        // Only return the media info if it is currently playing
        if (state === "playing") {
          chrome.runtime.sendMessage({ action: "getTabId" }, (response) => {
            const mediaWithTabId = {
              title: media.title,
              artist: media.artist,
              album: media.album,
              artwork: media.artwork[0]?.src,
              tabId: response.tabId,
            };
            resolve(mediaWithTabId); // Resolve the promise with the media info
          });
        } else {
          resolve(null); // Resolve with null if media is not playing
        }
      } else {
        resolve(null); // Resolve with null if mediaSession or metadata is not available
      }
    });
  }

  // Send media info to the extension
  setInterval(async () => {
    const mediaInfo = await getMediaInfo();
    if (mediaInfo) {
      chrome.runtime.sendMessage({
        action: "updateMedia",
        data: mediaInfo,
      });
    }
  }, 2000);
})();

//h3.html-h3.xdj266r.x11i5rnm.xat24cr.x1mh8g0r.xexx8yu.x4uap5.x18d9i69.xkhd6sd.x1vvkbs.x1heor9g.x1qlqyl8.x1pd3egz.x1a2a7pz.xzpqnlu.x1hyvwdk.xjm9jq1.x6ikm8r.x10wlt62.x10l6tqk.x1i1rx1s + div
