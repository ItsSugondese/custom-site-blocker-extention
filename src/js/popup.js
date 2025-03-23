// popup.js

import { saveState } from "./common/storage.js";
import { DataJsonKey } from "./enums/key-enums.js";

document.body.addEventListener("change", function (e) {
  if (
    e.target.type === "checkbox" &&
    e.target.closest("td.enable-disable-checkbox")
  ) {
    const key = e.target.value;
    const checked = e.target.checked;
    saveState(key, DataJsonKey.IS_ENABLED, checked);
  } else if (
    e.target.type === "checkbox" &&
    e.target.closest("td.enable-disable-redirect-checkbox")
  ) {
    const key = e.target.value;
    const checked = e.target.checked;
    saveState(key, DataJsonKey.SHOULD_REDIRECT, checked);
  }
});

// Load and apply saved states on popup open
document.addEventListener("DOMContentLoaded", function () {
  chrome.storage.local.get(null, function (result) {
    document
      .querySelectorAll('.enable-disable-checkbox input[type="checkbox"]')
      .forEach((checkbox) => {
        var data = result[checkbox.value];
        checkbox.checked =
          data !== undefined ? data[DataJsonKey.IS_ENABLED] ?? false : false;
      });

    document
      .querySelectorAll(
        '.enable-disable-redirect-checkbox input[type="checkbox"]'
      )
      .forEach((checkbox) => {
        var data = result[checkbox.value];
        checkbox.checked =
          data !== undefined
            ? data[DataJsonKey.SHOULD_REDIRECT] ?? false
            : false;
      });
  });
});
