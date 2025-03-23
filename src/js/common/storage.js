// Function to save state to chrome storage
export function saveState(siteUrlAsKey, dataKey, valueToSet) {
  chrome.storage.local.get(siteUrlAsKey, function (result) {
    const data = result[siteUrlAsKey] ?? {};
    valueToSet === undefined
      ? delete data[dataKey]
      : (data[dataKey] = valueToSet);
    chrome.storage.local.set({ [siteUrlAsKey]: data }, function () {});
  });
}
