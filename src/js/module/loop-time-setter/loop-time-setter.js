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
          setOnFieldByResult(
            result,
            tabs,
            "#skip-start-mmss",
            LoopTimeSetKey.SKIP_START
          );
          setOnFieldByResult(
            result,
            tabs,
            "#skip-end-mmss",
            LoopTimeSetKey.SKIP_END
          );
        });
      });
    });

    setOnInputEventForField("#start-mmss");
    setOnInputEventForField("#end-mmss");
    setOnInputEventForField("#skip-start-mmss");
    setOnInputEventForField("#skip-end-mmss");

    $("#closeSetTimerBtn").on("click", function () {
      //   saveSingleValueState(DataJsonKey.LOOP_START_TIME, $("#start-mmss").val());
      chrome.tabs.query(
        { active: true, currentWindow: true },
        async function (tabs) {
          const currentTab = tabs[0];

          const startVal = $("#start-mmss").val().trim();
          const endVal = $("#end-mmss").val().trim();
          const skipStartVal = $("#skip-start-mmss").val().trim();
          const skipEndVal = $("#skip-end-mmss").val().trim();

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
          await saveStateInKeyAsMap(
            DataJsonKey.LOOP_TIME_SET,
            currentTab.url,
            LoopTimeSetKey.SKIP_START,
            skipStartVal
          );
          await saveStateInKeyAsMap(
            DataJsonKey.LOOP_TIME_SET,
            currentTab.url,
            LoopTimeSetKey.SKIP_END,
            skipEndVal
          );

          // Send to background.js
          chrome.runtime.sendMessage({
            action: "loopTimeSetter",
            startTime: mmssToSeconds(startVal),
            endTime: mmssToSeconds(endVal),
            skipStartTime: mmssToSeconds(skipStartVal),
            skipEndTime: mmssToSeconds(skipEndVal),
            tab: currentTab,
          });
        }
      );
    });

    function enableDisableField() {
      const startValue = $("#start-mmss").val().trim();
      const endValue = $("#end-mmss").val().trim();
      const skipStartValue = $("#skip-start-mmss").val().trim();
      const skipEndValue = $("#skip-end-mmss").val().trim();
      const regex = /^([0-5]?\d):([0-5]\d)$/;

      if (
        (startValue === "" &&
          endValue === "" &&
          skipStartValue === "" &&
          skipEndValue === "") || // all empty is invalid
        (startValue !== "" && !regex.test(startValue)) || // if not empty, must match
        (endValue !== "" && !regex.test(endValue)) ||
        (skipStartValue !== "" && !regex.test(skipStartValue)) ||
        (skipEndValue !== "" && !regex.test(skipEndValue)) ||
        (skipStartValue === "" && skipEndValue !== "") ||
        (skipStartValue !== "" && skipEndValue === "")
        // one is filled and the other isn't — invalid
      ) {
        $("#closeSetTimerBtn")
          .prop("disabled", true)
          .removeAttr("data-bs-dismiss");
      } else if (
        (mmssToSeconds(endValue) != 0 &&
          mmssToSeconds(startValue) >= mmssToSeconds(endValue)) ||
        (mmssToSeconds(skipStartValue) != 0 &&
          mmssToSeconds(skipStartValue) >= mmssToSeconds(skipEndValue)) ||
        (mmssToSeconds(startValue) != 0 &&
          mmssToSeconds(skipStartValue) != 0 &&
          mmssToSeconds(skipStartValue) < mmssToSeconds(startValue)) ||
        (mmssToSeconds(endValue) != 0 &&
          mmssToSeconds(skipEndValue) != 0 &&
          mmssToSeconds(skipEndValue) > mmssToSeconds(endValue))
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

    function setOnInputEventForField(element) {
      $(element).on("input", function () {
        enableDisableField();
      });
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
