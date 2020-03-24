function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    // console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      // console.log(response);
    });
  });
}

const partyButton = $("#partyButton");
const followButton = $("#followButton");
const partyElem = partyButton.get(0)
const followElem = followButton.get(0)
let partyOn = false;
let followOn = false;


partyButton.text('Turn On Party Mode')
followButton.text('Turn On Follow Mode')
partyElem.style.color = "whitesmoke"
followElem.style.color = "whitesmoke"
partyElem.style.backgroundColor = "steelblue"
followElem.style.backgroundColor = "steelblue"

partyButton.on("click", function() {
  sendMessage({ type: "follow", toggle: !partyOn });
  partyOn = !partyOn;
  if(partyOn) {
    partyButton.text('Party Mode On!!!')
    partyElem.style.backgroundColor = "seagreen"
    followButton.text('Turn On Follow Mode')
    followElem.style.backgroundColor = "steelblue"
  } else {
    partyButton.text('Turn On Party Mode')
    partyElem.style.backgroundColor = "steelblue"
  }
});

followButton.on("click", function() {
  sendMessage({ type: "party", toggle: !followOn });
  followOn = !followOn;
  if(followOn) {
    followButton.text('Follow Mode On!!!')
    followElem.style.backgroundColor = "seagreen"
    partyButton.text('Turn On Party Mode')
    partyElem.style.backgroundColor = "steelblue"
  } else {
    followButton.text('Turn On Follow Mode')
    followElem.style.backgroundColor = "steelblue"
  }
});
