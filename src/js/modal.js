import { saveState } from "./common/storage.js";
import { DataJsonKey } from "./enums/key-enums.js";

// Get modal elements
var modal = document.getElementById("myModal");
var closeButton = document.getElementsByClassName("close")[0];
var submitBtn = document.getElementById("submitBtn");
var inputField = document.getElementById("inputField");

var key;
// Open the modal when any button with data-modal-target is clicked
document.querySelectorAll("[data-modal-target]").forEach((button) => {
  button.onclick = function () {
    key = button.value;
    chrome.storage.local.get(key, function (result) {
      let keyValueFromStorage = result[key] ?? undefined;
      const existingUrl =
        keyValueFromStorage !== undefined
          ? keyValueFromStorage[DataJsonKey.REDIRECT_URL] ?? ""
          : "";

      document.getElementById("inputField").value = existingUrl;
      modal.style.display = "block";
    });
  };
});

// Close the modal when the close button is clicked
closeButton.onclick = function () {
  modal.style.display = "none";
};

// Close the modal if the user clicks outside of the modal
window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// Handle form submission
submitBtn.onclick = function () {
  var inputVal = inputField.value;
  inputVal = inputVal === "" ? undefined : inputVal;
  saveState(key, DataJsonKey.REDIRECT_URL, inputVal);
  modal.style.display = "none"; // Close the modal after submitting
};
