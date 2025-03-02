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
    const currentTabUrl = tab.url;

    if (
      currentTabUrl.includes("reels") ||
      currentTabUrl === "https://www.instagram.com/" ||
      currentTabUrl === "https://www.instagram.com"
    ) {
      chrome.tabs.update(tabId, {
        url: "https://www.instagram.com/direct/inbox/",
      });
    } else if (
      currentTabUrl === "https://www.facebook.com/" ||
      currentTabUrl === "https://www.facebook.com"
    ) {
      chrome.tabs.update(tabId, {
        url: "https://www.facebook.com/messages/new",
      });
    } else if (currentTabUrl.startsWith("https://www.linkedin.com/")) {
      chrome.tabs.remove(tabId);
    }
  }
});
