import { saveSingleValueState } from "../../common/storage.js";
import { DataJsonKey } from "../../enums/key-enums.js";

$(function () {
  const key = DataJsonKey.SELECTED_COLOR;

  // Retrieve the color from local storage
  chrome.storage.local.get(key, function (result) {
    const selectedColor = result[key];

    if (selectedColor) {
      $("#colorPicker").val(rgbaToHex(selectedColor));
    } else {
      // Set a default color if no color is selected
      $("#colorPicker").val("#000000");
    }
  });

  // When the user selects a new color, save it to local storage
  $("#colorPicker").on("input", function () {
    saveSingleValueState(DataJsonKey.SELECTED_COLOR, hexToRgba($(this).val()));
  });
});

// Convert RGBA to Hex
function rgbaToHex(rgba) {
  const matches = rgba.match(/^rgba\((\d+), (\d+), (\d+), (\d+(\.\d+)?)\)$/);
  if (!matches) return null;

  const r = parseInt(matches[1], 10);
  const g = parseInt(matches[2], 10);
  const b = parseInt(matches[3], 10);
  const a = parseFloat(matches[4]);

  // Handle transparency: if fully transparent, return #000000 (black)
  if (a === 0) {
    return "#000000";
  }

  // Convert rgba to hex
  return (
    "#" +
    ((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1).toUpperCase()
  );
}

// Convert Hex to RGBA
function hexToRgba(hex) {
  // Ensure the hex format is 6 characters
  const hexCode = hex.replace("#", "");
  const r = parseInt(hexCode.slice(0, 2), 16);
  const g = parseInt(hexCode.slice(2, 4), 16);
  const b = parseInt(hexCode.slice(4, 6), 16);

  // Assuming full opacity by default
  return `rgba(${r}, ${g}, ${b}, 1)`;
}
