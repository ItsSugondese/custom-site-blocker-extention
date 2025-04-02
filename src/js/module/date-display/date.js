import NepaliDate from "../../../../node_modules/nepali-date-converter/dist/nepali-date-converter.es5.js";

$(function () {
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
});
