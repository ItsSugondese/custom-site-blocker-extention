(() => {
  // chrome.extension.onMessage.addListener(function (
  //   request,
  //   sender,
  //   sendResponse
  // ) {
  //   console.log("Here I'm");
  //   if (message.action === "DISABLE_SCROLL") {
  //     console.log(message.value);
  //     if (!message.value) {
  //       document.body.style.overflow = "auto";
  //       document.documentElement.style.overflow = "auto";
  //     } else {
  //       document.body.style.overflow = "hidden";
  //       document.documentElement.style.overflow = "hidden";
  //     }
  //   }

  //   sendResponse({ status: "everything ok" });
  //   return true;
  // });

  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "DISABLE_SCROLL") {
      if (!message.value) {
        document.body.style.overflow = "auto";
        document.documentElement.style.overflow = "auto";
      } else {
        document.body.style.overflow = "hidden";
        document.documentElement.style.overflow = "hidden";
      }
    }
    sendResponse({ status: "everything ok" });
    return true;
  });
})();
