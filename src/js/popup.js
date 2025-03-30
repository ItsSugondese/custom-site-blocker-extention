// popup.js

import { saveState } from "./common/storage.js";
import { DataJsonKey } from "./enums/key-enums.js";
// Load and apply saved states on popup open
$(function () {
  // Initial load

  chrome.storage.local.get(null, function (result) {
    $('.enable-disable-checkbox input[type="checkbox"]').each(function () {
      var checkbox = $(this);
      var data = result[checkbox.val()];
      checkbox.prop(
        "checked",
        data !== undefined ? data[DataJsonKey.IS_ENABLED] ?? false : false
      );
    });

    $('.enable-disable-redirect-checkbox input[type="checkbox"]').each(
      function () {
        var checkbox = $(this);
        var data = result[checkbox.val()];
        checkbox.prop(
          "checked",
          data !== undefined
            ? data[DataJsonKey.SHOULD_REDIRECT] ?? false
            : false
        );
      }
    );

    $('.enable-disable-scroll-checkbox input[type="checkbox"]').each(
      function () {
        var checkbox = $(this);
        var data = result[checkbox.val()];
        checkbox.prop(
          "checked",
          data !== undefined
            ? data[DataJsonKey.SHOULD_DISABLE_SCROLL] ?? false
            : false
        );
      }
    );
  });
});

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
  } else if (
    e.target.type === "checkbox" &&
    e.target.closest("td.enable-disable-scroll-checkbox")
  ) {
    const key = e.target.value;
    const checked = e.target.checked;
    saveState(key, DataJsonKey.SHOULD_DISABLE_SCROLL, checked);
  }
});
