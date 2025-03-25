import { DataJsonKey, FilterJsonKey } from "./enums/key-enums.js";

document.addEventListener("DOMContentLoaded", function () {
  let key = DataJsonKey.PLATFORM;
  chrome.storage.local.get(key, function (result) {
    console.log();
    const platforms = Object.keys(result[key]).map((subKey) => {
      console.log(subKey);
      console.log(result[key][subKey]);
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
        data-modal-target="myModal"
        value="${platform.toUpperCase()}"
      >
        Set
      </button>
    </td>
  `;

      tbody.appendChild(tr);
    });
  });
});
