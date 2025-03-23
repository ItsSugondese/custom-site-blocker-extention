chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url && tab.url.includes("formsmarts")) {
    console.log("Sending message to content script");

    // Ensure the content script is injected before sending a message
    chrome.tabs.sendMessage(
      tabId,
      {
        type: "NEW",
      },
      (response) => {
        if (chrome.runtime.lastError) {
          console.error(
            "Content script not reachable:",
            chrome.runtime.lastError.message
          );
        }
      }
    );
  }
});

// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "submitValue") {
    const value = message.value;
    console.log("Received value:", value);

    // Send a message to the content script to set the value in the DOM
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        console.log("Sending value to content script in tab", tabs[0].id);
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "setValue",
          value: value,
        });
      }
    });

    // Optionally, send a response back
    sendResponse({
      status: "success",
      message: "Value received and processed",
    });
  }
  return true; // Keep the message channel open for async response
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active) {
    const siteName = extractSiteName(tab.url).toUpperCase();
    chrome.storage.local.get(siteName, function (result) {
      const getDataForSite = result[siteName] ?? {};
      siteActionPerformCondition(siteName, tab, getDataForSite);
    });
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
  if (isToggled) {
    if (site == "INSTAGRAM") {
      if (
        currentTabUrl.includes("reels") ||
        currentTabUrl === "https://www.instagram.com/"
      ) {
        if (shouldRedirect) {
          chrome.tabs.update(tabId, {
            url:
              data[DataJsonKey.REDIRECT_URL] ??
              "https://www.instagram.com/direct/inbox/",
          });
        } else {
          chrome.tabs.remove(tabId);
        }
      }
    } else if (site == "FACEBOOK") {
      if (currentTabUrl === "https://www.facebook.com/") {
        if (shouldRedirect) {
          chrome.tabs.update(tabId, {
            url:
              data[DataJsonKey.REDIRECT_URL] ??
              "https://www.facebook.com/messages/new",
          });
        } else {
          chrome.tabs.remove(tabId);
        }
      }
    } else if (site == "LINKEDIN") {
      if (currentTabUrl === "https://www.linkedin.com/") {
        if (shouldRedirect) {
          chrome.tabs.update(tabId, {
            url:
              data[DataJsonKey.REDIRECT_URL] ??
              "https://www.linkedin.com/in/rohan-niraula-427769231/",
          });
        } else {
          chrome.tabs.remove(tabId);
        }
      }
    } else if (site == "REDDIT") {
      if (
        currentTabUrl === "https://www.reddit.com/" ||
        currentTabUrl === "https://www.reddit.com/r/all/" ||
        currentTabUrl === "https://www.reddit.com/explore/" ||
        currentTabUrl === "https://www.reddit.com/" ||
        currentTabUrl === "https://www.reddit.com/?feed=home"
      ) {
        if (shouldRedirect) {
          chrome.tabs.update(tabId, {
            url:
              data[DataJsonKey.REDIRECT_URL] ??
              "https://www.reddit.com/r/NepalSocial/",
          });
        } else {
          chrome.tabs.remove(tabId);
        }
      }
    }
  }

  if (site == "YOUTUBE") {
    if (currentTabUrl === "https://www.youtube.com/") {
      if (shouldRedirect) {
        chrome.tabs.sendMessage(
          tabId,
          {
            action: "DISABLE_SCROLL",
            value: isToggled,
          },
          (response) => {
            if (chrome.runtime.lastError) {
              console.error(
                "Content script not reachable:",
                chrome.runtime.lastError.message
              );
            }
          }
        );
      } else {
        chrome.tabs.remove(tabId);
      }
    }
  }
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
});
