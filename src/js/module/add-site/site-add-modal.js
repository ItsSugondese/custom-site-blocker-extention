import { savePlatformObject, saveState } from "../../common/storage.js";
import { DataJsonKey, FilterJsonKey } from "../../enums/key-enums.js";

$(function () {
  loadModalHtmlFile();
});

function loadModalHtmlFile() {
  const modalUrl = chrome.runtime.getURL("src/add-site-modal.html"); // Corrected file path

  $.get(modalUrl, function (data) {
    // Check if the modal already exists and clear it if it does.
    if ($("#addSiteModal").length) {
      $("#addSiteModal").remove();
    }

    // Append the modal to the body
    $("body").append(data);

    // Now that the modal is loaded, attach the form submission handler
    $("#siteAddForm").submit(function (event) {
      event.preventDefault(); // Prevent default form submission

      let siteName = $("#siteNameField").val();
      let redirectUrl = $("#redirectUrlField").val();
      let matchUrl = $("#matchUrlTextArea").val();
      let containsUrl = $("#containsUrlTextArea").val();

      // Check if siteName is empty
      if (!siteName) {
        $("#siteNameOutput")
          .removeClass("d-none")
          .text("Please enter site name");
      } else {
        $("#siteNameOutput").addClass("d-none"); // Apply text-success (green) if site name is entered

        let platformKey = DataJsonKey.PLATFORM;
        chrome.storage.local.get(platformKey, async function (result) {
          const platforms = Object.keys(result[platformKey]).map((subKey) => {
            return result[platformKey][subKey][
              FilterJsonKey.NAME
            ].toUpperCase();
          });

          var uppercaseSiteName = siteName.toUpperCase();
          if (platforms.includes(uppercaseSiteName)) {
            $("#siteNameOutput")
              .removeClass("d-none")
              .text("Site with that name alredy exists");
          } else {
            var containsUrlListFromField = containsUrl
              ? containsUrl
                  .split("\n")
                  .map((item) => item.trim())
                  .filter((item) => item)
              : [];

            var includeUrlListFromField = matchUrl
              ? matchUrl
                  .split("\n")
                  .map((item) => item.trim())
                  .filter((item) => item)
              : [];

            const valueToAdd = {
              [FilterJsonKey.NAME]: siteName,
              [FilterJsonKey.INCLUDE]: includeUrlListFromField,
              [FilterJsonKey.CONTAINS]: containsUrlListFromField,
            };

            await savePlatformObject(uppercaseSiteName, valueToAdd);

            if (redirectUrl) {
              await saveState(
                uppercaseSiteName,
                DataJsonKey.REDIRECT_URL,
                redirectUrl
              );
            }

            window.close();
          }
        });
      }
    });
  });
}
