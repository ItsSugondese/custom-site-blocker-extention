import { saveSingleValueState } from "../../common/storage.js";
import { DataJsonKey } from "../../enums/key-enums.js";

$(function () {
  const modalUrl = chrome.runtime.getURL("src/note-modal.html"); // Corrected file path

  $.get(modalUrl, function (data) {
    // Check if the modal already exists and clear it if it does.
    if ($("#noteModal").length) {
      $("#noteModal").remove();
    }

    // Append the modal to the body
    $("body").append(data);

    $("#noteModal").on("show.bs.modal", function (event) {
      chrome.storage.local.get(DataJsonKey.NOTE_TAKEN, function (result) {
        const noteData = result[DataJsonKey.NOTE_TAKEN] ?? "";
        $("#noteArea").val(noteData);
      });
    });

    $("#noteModal").on("hide.bs.modal", function (event) {
      const noteTaken = $("#noteArea").val();

      if (noteTaken) {
        saveSingleValueState(DataJsonKey.NOTE_TAKEN, noteTaken);
      }
    });
  });
});
