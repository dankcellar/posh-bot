"use strict";

function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, message, function (response) {
      console.log(response);
    });
  });
}

let partyOn = false;
let followOn = false;

const followButton = $("#followButton");
const partyButton = $("#partyButton");
followButton.text("Toggle Follow Mode");
partyButton.text("Toggle Party Mode");

followButton.on("click", function (event) {
  event.preventDefault();
  followOn = !followOn;
  sendMessage({ type: "follow", toggle: followOn });
  if (followOn) {
    followButton.text("Follow Mode On");
    followButton.addClass("pure-button-active");

    partyButton.text("Toggle Party Mode");
    partyButton.removeClass("pure-button-active");
  } else {
    followButton.text("Toggle Follow Mode");
    followButton.removeClass("pure-button-active");
  }
});

partyButton.on("click", function (event) {
  event.preventDefault();
  partyOn = !partyOn;
  sendMessage({ type: "party", toggle: partyOn });
  if (partyOn) {
    partyButton.text("Party Mode On");
    partyButton.addClass("pure-button-active");

    followButton.text("Toggle Follow Mode");
    followButton.removeClass("pure-button-active");
  } else {
    partyButton.text("Toggle Party Mode");
    partyButton.removeClass("pure-button-active");
  }
});

const version = chrome.runtime.getManifest().version;
const versionText = $("#versionText").text(`Version: ${version}`);
