$(function () {
  $("#disturbInput").on("change", function () {
    chrome.runtime.sendMessage({
      action: "disturbToggle",
      value: $(this).is(":checked"),
    });
  });
});
