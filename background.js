chrome.runtime.onInstalled.addListener(() => {
  const platforms = {
    YOUTUBE: {
      [FilterJsonKey.NAME]: "YouTube",
      [FilterJsonKey.INCLUDE]: ["https://www.youtube.com/"],
    },
    REDDIT: {
      [FilterJsonKey.NAME]: "Reddit",
      [FilterJsonKey.INCLUDE]: [
        "https://www.reddit.com/",
        "https://www.reddit.com/r/all/",
        "https://www.reddit.com/explore/",
        "https://www.reddit.com/",
        "https://www.reddit.com/?feed=home",
      ],
    },
    FACEBOOK: {
      [FilterJsonKey.NAME]: "Facebook",
      [FilterJsonKey.INCLUDE]: ["https://www.facebook.com/"],
    },
    INSTAGRAM: {
      [FilterJsonKey.NAME]: "Instagram",
      [FilterJsonKey.INCLUDE]: ["https://www.instagram.com/"],
      [FilterJsonKey.CONTAINS]: ["https://www.instagram.com/reels/"],
    },
    LINKEDIN: {
      [FilterJsonKey.NAME]: "LinkedIn",
      [FilterJsonKey.INCLUDE]: ["https://www.linkedin.com/feed/"],
    },
  };
  chrome.storage.local.set(
    { [DataJsonKey.PLATFORM]: platforms },
    function () {}
  );
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && tab.url.startsWith("http")) {
    const siteName = extractSiteName(tab.url).toUpperCase();
    chrome.storage.local.get(siteName, function (result) {
      const getDataForSite = result[siteName] ?? {};
      siteActionPerformCondition(siteName, tab, getDataForSite);
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "togglePause") {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        chrome.tabs.sendMessage(
          tab.id,
          {
            action: "togglePause",
            isPaused: true,
          },
          (response) => {}
        );
      });
    });
  } else if (message.action === "closeAllTab") {
    closeAllTabsExceptAudio(message.value);
  }
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let key in changes) {
    const updatedData = changes[key].newValue;
    // Get the active tab URL
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        siteActionPerformCondition(key, tabs[0], updatedData);
      }
    });
  }
});

function siteActionPerformCondition(site, tab, data) {
  const currentTabUrl = tab.url;
  const tabId = tab.id;

  isToggled = data[DataJsonKey.IS_ENABLED] ?? false;
  shouldRedirect = data[DataJsonKey.SHOULD_REDIRECT] ?? false;
  shouldDisableScroll = data[DataJsonKey.SHOULD_DISABLE_SCROLL] ?? false;

  chrome.storage.local.get(DataJsonKey.PLATFORM, function (result) {
    const includeUrl =
      result[DataJsonKey.PLATFORM][site][FilterJsonKey.INCLUDE] ?? [];
    const containsUrl =
      result[DataJsonKey.PLATFORM][site][FilterJsonKey.CONTAINS] ?? [];

    if (
      containsUrl.some((prefix) => currentTabUrl.startsWith(prefix)) ||
      includeUrl.includes(currentTabUrl)
    ) {
      sendMessage(
        tabId,
        "DISABLE_SCROLL",
        isToggled ? shouldDisableScroll : false,
        site
      );
      if (isToggled) {
        if (!shouldDisableScroll) {
          if (shouldRedirect) {
            //www.youtube.com/watch?v=dQw4w9WgXcQ
            chrome.tabs.update(tabId, {
              url:
                data[DataJsonKey.REDIRECT_URL] ??
                "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
            });
          } else {
            chrome.tabs.remove(tabId);
          }
        }
      }
    } else {
      sendMessage(tabId, "DISABLE_SCROLL", false, site);
    }
  });
}

function sendMessage(tabId, action, value, site) {
  chrome.tabs.sendMessage(
    tabId,
    {
      action: action,
      value: value,
      site: site,
    },
    (response) => {}
  );
}

function closeAllTabsExceptAudio(site) {
  chrome.tabs.query({}, function (tabs) {
    tabs.forEach((tab) => {
      // Check if the tab has audio playing
      if (
        site === undefined ||
        tab.url.toLowerCase().includes(site.toLowerCase())
      ) {
        chrome.scripting.executeScript(
          {
            target: { tabId: tab.id },
            func: site === undefined ? checkAudioPlaying : null,
          },
          (result) => {
            if (!(result && result[0].result)) {
              chrome.tabs.remove(tab.id); // Close the tab if no audio is playing
            }
          }
        );
      }
    });
  });
}

// Function to check if audio is playing in a tab
function checkAudioPlaying() {
  const media = document.querySelector("audio, video");
  return media && !media.paused && media.readyState > 2; // Checking if audio/video is playing
}

function extractSiteName(url) {
  const hostname = new URL(url).hostname; // Get the hostname from the URL
  const siteName = hostname.split(".")[1]; // Extract the site name (e.g., "instagram" from "www.instagram.com")
  return siteName;
}

const DataJsonKey = Object.freeze({
  IS_ENABLED: "IsEnabled",
  SHOULD_REDIRECT: "ShouldRedirect",
  REDIRECT_URL: "RedirectUrl",
  SHOULD_DISABLE_SCROLL: "ShouldDisableScroll",
  PLATFORM: "Platform",
});

const FilterJsonKey = Object.freeze({
  NAME: "Name",
  INCLUDE: "Include",
  CONTAINS: "Contains",
});
