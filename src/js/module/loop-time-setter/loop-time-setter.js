import {
  saveSingleValueState,
  saveStateInKeyAsMap,
} from "../../common/storage.js";
import { DataJsonKey, LoopTimeSetKey } from "../../enums/key-enums.js";

$(function () {
  loadModalHtmlFile();
});

function loadModalHtmlFile() {
  const modalUrl = chrome.runtime.getURL("src/loop-time-setter-modal.html"); // Corrected file path

  $.get(modalUrl, function (data) {
    // Check if the modal already exists and clear it if it does.
    if ($("#loopTimeSetterModal").length) {
      $("#loopTimeSetterModal").remove();
    }

    // Append the modal to the body
    $("body").append(data);

    $("#loopTimeSetterModal").on("show.bs.modal", function (event) {
      chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.get(DataJsonKey.LOOP_TIME_SET, function (result) {
          setOnFieldByResult(
            result,
            tabs,
            "#start-mmss",
            LoopTimeSetKey.START_TIME
          );
          setOnFieldByResult(
            result,
            tabs,
            "#end-mmss",
            LoopTimeSetKey.END_TIME
          );
        });
      });
    });
    $("#start-mmss").on("input", function () {
      enableDisableField();
    });
    $("#end-mmss").on("input", function () {
      enableDisableField();
    });

    $("#closeSetTimerBtn").on("click", function () {
      //   saveSingleValueState(DataJsonKey.LOOP_START_TIME, $("#start-mmss").val());
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async function (tabs) {
          const currentTab = tabs[0];

          const startVal = $("#start-mmss").val().trim();
          const endVal = $("#end-mmss").val().trim();

          await saveStateInKeyAsMap(
            DataJsonKey.LOOP_TIME_SET,
            currentTab.url,
            LoopTimeSetKey.START_TIME,
            startVal
          );

          await saveStateInKeyAsMap(
            DataJsonKey.LOOP_TIME_SET,
            currentTab.url,
            LoopTimeSetKey.END_TIME,
            endVal
          );

          // Send to background.js
          chrome.runtime.sendMessage({
            action: "loopTimeSetter",
            startTime: mmssToSeconds(startVal),
            endTime: mmssToSeconds(endVal),
            tab: currentTab,
          });
        }
      );
    });

    function enableDisableField() {
      const startValue = $("#start-mmss").val().trim();
      const endValue = $("#end-mmss").val().trim();
      const regex = /^([0-5]?\d):([0-5]\d)$/;

      if (
        (startValue === "" && endValue === "") || // both empty is invalid
        (startValue !== "" && !regex.test(startValue)) || // if not empty, must match
        (endValue !== "" && !regex.test(endValue)) // same here
      ) {
        $("#closeSetTimerBtn")
          .prop("disabled", true)
          .removeAttr("data-bs-dismiss");
      } else if (
        mmssToSeconds(endValue) != 0 &&
        mmssToSeconds(startValue) >= mmssToSeconds(endValue)
      ) {
        $("#closeSetTimerBtn")
          .prop("disabled", true)
          .removeAttr("data-bs-dismiss");
      } else {
        $("#closeSetTimerBtn")
          .prop("disabled", false)
          .attr("data-bs-dismiss", "modal");
      }
    }

    function setOnFieldByResult(result, tabs, element, fieldKey) {
      var noteData = result[DataJsonKey.LOOP_TIME_SET] ?? {};

      if (Object.keys(noteData).length === 0) {
        $(element).val("");
        return;
      }

      noteData = noteData[tabs[0].url] ?? null;

      if (noteData == null) {
        $(element).val("");
        return;
      }

      $(element).val(noteData[LoopTimeSetKey[fieldKey]] ?? "");
      enableDisableField();
    }
  });
}

function mmssToSeconds(timeStr) {
  if (timeStr.length === 0) {
    return 0;
  }
  const parts = timeStr.split(":");
  const minutes = parseInt(parts[0], 10);
  const seconds = parseInt(parts[1], 10);
  return minutes * 60 + seconds;
}
