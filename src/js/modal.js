import { saveState, saveStateInPlatformObject } from "./common/storage.js";
import { DataJsonKey, FilterJsonKey } from "./enums/key-enums.js";

// Get modal elements
const submitBtn = document.getElementById("submitBtn");
var key;

$(function () {
  $("#setUrlModal").on("show.bs.modal", function (event) {
    const button = event.relatedTarget; // Button that triggered the modal
    key = button.value;

    chrome.storage.local.get(DataJsonKey.PLATFORM, function (result) {
      let keyValueFromStorage =
        result[DataJsonKey.PLATFORM]?.[key] ?? undefined;
      const includedUrlList =
        keyValueFromStorage !== undefined
          ? keyValueFromStorage[FilterJsonKey.INCLUDE] ?? []
          : [];
      const includedUrlString = includedUrlList.join("\n");

      $("#includeUrlField").val(includedUrlString);

      const constainsUrlList =
        keyValueFromStorage !== undefined
          ? keyValueFromStorage[FilterJsonKey.CONTAINS] ?? []
          : [];
      const constainsUrlString = constainsUrlList.join("\n");

      $("#containsUrlField").val(constainsUrlString);
    });

    chrome.storage.local.get(key, function (result) {
      let keyValueFromStorage = result[key] ?? undefined;

      const includedUrlString =
        keyValueFromStorage !== undefined
          ? keyValueFromStorage[DataJsonKey.REDIRECT_URL] ?? ""
          : "";
      $("#redirectUrlField").val(includedUrlString);
    });
  });
  $("#submitBtn").on("click", async function () {
    $("#submitBtn").prop("disabled", true);
    const includeUrlString = $("#includeUrlField").val();
    var includeUrlListFromField = includeUrlString
      ? includeUrlString
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];

    const containsUrlString = $("#containsUrlField").val();
    var containsUrlListFromField = containsUrlString
      ? containsUrlString
          .split("\n")
          .map((item) => item.trim())
          .filter((item) => item)
      : [];

    saveState(key, DataJsonKey.REDIRECT_URL, $("#redirectUrlField").val());
    await saveStateInPlatformObject(
      key,
      FilterJsonKey.INCLUDE,
      includeUrlListFromField
    );
    await saveStateInPlatformObject(
      key,
      FilterJsonKey.CONTAINS,
      containsUrlListFromField
    );

    $("#closeBtn").trigger("click");
    $("#submitBtn").prop("disabled", false);
  });
});
