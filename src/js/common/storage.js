import { DataJsonKey } from "../enums/key-enums.js";

// Function to save state to chrome storage
export function saveState(siteUrlAsKey, dataKey, valueToSet) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(siteUrlAsKey, function (result) {
      const data = result[siteUrlAsKey] ?? {};
      valueToSet === undefined
        ? delete data[dataKey]
        : (data[dataKey] = valueToSet);
      chrome.storage.local.set({ [siteUrlAsKey]: data }, function () {
        resolve();
      });
    });
  });
}

// Function to save state to chrome storage
export function saveSingleValueState(key, valueToSet) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      chrome.storage.local.set({ [key]: valueToSet }, function () {
        resolve();
      });
    });
  });
}

export function saveStateInPlatformObject(siteUrlAsKey, dataKey, valueToSet) {
  const key = DataJsonKey.PLATFORM;

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      const data = { ...result[key] };
      const siteValueToModify = result[key][siteUrlAsKey] ?? {};

      siteValueToModify[dataKey] = valueToSet ?? [];

      // Update the object back to the original data
      data[siteUrlAsKey] = siteValueToModify;

      chrome.storage.local.set({ [key]: data }, function () {
        resolve(); // Resolve the promise when saving is done
      });
    });
  });
}

export function saveStateInKeyAsMap(mainKey, key, dataKey, valueToSet) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(mainKey, function (result) {
      const data = { ...result[mainKey] };

      let siteValueToModify;
      if (Object.keys(data).length === 0) {
        siteValueToModify = {};
      } else {
        siteValueToModify = result[mainKey][key] ?? {};
      }

      siteValueToModify[dataKey] = valueToSet ?? null;

      // Update the object back to the original data
      data[key] = siteValueToModify;

      chrome.storage.local.set({ [mainKey]: data }, function () {
        resolve(); // Resolve the promise when saving is done
      });
    });
  });
}

export function savePlatformObject(subKey, valueToSet) {
  const key = DataJsonKey.PLATFORM;

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      const data = { ...result[key] };
      data[subKey] = valueToSet;

      chrome.storage.local.set({ [key]: data }, function () {
        resolve(); // Resolve the promise when saving is done
      });
    });
  });
}
export function removeFromPlatformObject(subKey) {
  const key = DataJsonKey.PLATFORM;

  return new Promise((resolve, reject) => {
    chrome.storage.local.get(key, function (result) {
      const data = { ...result[key] };
      delete data[subKey];

      chrome.storage.local.set({ [key]: data }, function () {
        resolve(); // Resolve the promise when saving is done
      });
    });
  });
}

export function removeObject(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.remove(key, function () {
      resolve(); // Resolve the promise when removal is done
    });
  });
}
