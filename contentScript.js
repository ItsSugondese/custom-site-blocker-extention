(() => {
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "setValue") {
      const value = message.value;
      const textarea = document.getElementsByName("01___title")[0];

      console.log("changed value is " + value);
      textarea.value = value;

      if (textarea) {
        console.log("Textarea value set:", value);
      } else {
        console.log("Textarea element not found!");
      }
    }
  });
})();
