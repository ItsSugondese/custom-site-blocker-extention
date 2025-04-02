import { DataJsonKey, FilterJsonKey } from "../../enums/key-enums.js";
import { modalWhenPopUp, submitModalOperation } from "./modal.js";

$(function () {
  let key = DataJsonKey.PLATFORM;
  chrome.storage.local.get(key, function (result) {
    const platforms = Object.keys(result[key]).map((subKey) => {
      return result[key][subKey][FilterJsonKey.NAME];
    });

    const tbody = document.querySelector("#platformTable tbody");

    if (!tbody) {
      console.error("Table body not found!");
      return;
    }

    platforms.forEach((platform) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
    <td>${platform}</td>
    ${[
      "enable-disable-checkbox",
      "enable-disable-scroll-checkbox",
      "enable-disable-redirect-checkbox",
    ]
      .map(
        (cls) => `
          <td class="${cls}">
            <label class="toggle-switch">
              <input type="checkbox" value="${platform.toUpperCase()}" />
              <span class="slider"></span>
            </label>
          </td>
        `
      )
      .join("")}
    <td>
      <button
        class="set-redirect"
        data-bs-toggle="modal" 
        data-bs-target="#setUrlModal"
        
        value="${platform.toUpperCase()}"
      >
        Set
      </button>
    </td>
    <td>
      <button
        class="close-related-platform-tabs"
        value="${platform.toUpperCase()}"
      >
        Close
      </button>
    </td>
  `;

      tbody.appendChild(tr);
    });

    // Select all the buttons with the class 'close-related-platform-tabs'
    whenPressedCloseSiteTabButton();

    loadModalHtmlFile();
  });
});

function whenPressedCloseSiteTabButton() {
  $(".close-related-platform-tabs").on("click", function () {
    chrome.runtime.sendMessage({
      action: "closeAllTab",
      value: this.value,
    });
  });
}

function loadModalHtmlFile() {
  const modalUrl = chrome.runtime.getURL("src/redirect-url-modal.html"); // Corrected file path

  $.get(modalUrl, function (data) {
    // Check if the modal already exists and clear it if it does.
    if ($("#setUrlModal").length) {
      $("#setUrlModal").remove();
    }

    // Append the modal to the body
    $("body").append(data);

    modalWhenPopUp();

    submitModalOperation();
  });
}
