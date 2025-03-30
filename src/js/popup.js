// popup.js

import { saveState } from "./common/storage.js";
import { DataJsonKey } from "./enums/key-enums.js";
import NepaliDate from "../../node_modules/nepali-date-converter/dist/nepali-date-converter.es5.js";

// Load and apply saved states on popup open
$(function () {
  dateHeader();

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

function dateHeader() {
  const date = new Date();
  const nepaliDate = new NepaliDate(date);

  var formattedEngDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "2-digit",
  });

  var formattedNepaliDate = nepaliDate.format("MMMM DD");

  $("#date-setter").text(
    "Date : " + formattedNepaliDate + " / " + formattedEngDate
  );
  $("#date-setter").css({
    color: [0, 6].includes(nepaliDate.getDay()) ? "red" : "black",
    cursor: "pointer",
  });
  $("#date-setter").on("click", function () {
    chrome.tabs.create({ url: "https://www.hamropatro.com/" });
  });
}
