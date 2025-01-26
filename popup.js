// popup.js
document.addEventListener("DOMContentLoaded", function () {
  // Get references to elements
  const submitButton = document.getElementById("submitButton");
  const textarea = document.getElementById("myTextarea");

  // Add an event listener to the button
  submitButton.addEventListener("click", function () {
    const textareaValue = textarea.value;

    // Send the textarea value to the extension background script
    chrome.runtime.sendMessage(
      { action: "submitValue", value: textareaValue },
      function (response) {
        console.log("Response from background:", response);
      }
    );
  });
});
