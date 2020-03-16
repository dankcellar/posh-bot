"use strict";

chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  console.log([message, sender, sendResponse]);
});

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
  if (changeInfo.status == "complete") {
    chrome.tabs.sendMessage(tabId, {
      message: "load_complete",
      tabId: tabId,
      tab: tab
    });
  }
});
