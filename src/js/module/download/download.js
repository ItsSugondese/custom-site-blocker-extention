import { saveState } from "../../common/storage.js";
import { DataJsonKey, DownloadUrlJsonKey } from "../../enums/key-enums.js";

$(function () {
  const $button = $("#downloadButton");
  const $dropdown = $("#dropdownMenu");
  const $buttonText = $("#buttonText");

  // Option selection
  $dropdown.on("click", ".dropdown-item", function (event) {
    event.preventDefault();
    const option = $(this).data("option");
    handleOption(option);
  });

  function handleOption(option) {
    console.log("Selected:", option);
    const dropdownInstance = bootstrap.Dropdown.getOrCreateInstance($button[0]);
    dropdownInstance.hide();

    chrome.tabs.query(
      { active: true, currentWindow: true },
      async function (tabs) {
        const url = tabs[0].url;
        if (url.startsWith("https://www.youtube.com/")) {
          const downloadType = option.toUpperCase();
          await saveState(
            DataJsonKey.DOWNLOAD_URL,
            DownloadUrlJsonKey.URL,
            url
          );
          await saveState(
            DataJsonKey.DOWNLOAD_URL,
            DownloadUrlJsonKey.DOWNLOAD_TYPE,
            downloadType
          );
          if (downloadType === "MUSIC") {
            chrome.tabs.create({ url: "https://emp3juice.la/" });
          } else {
            // let updatedUrl = url.replace(/(https?:\/\/www\.)/, "$1ss"); // Append 'ss' after 'www.'
            chrome.tabs.create({ url: "https://en1.savefrom.net/" });
          }
        }
      }
    );
  }
});
