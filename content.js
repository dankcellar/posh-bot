"use strict";

let running = false;
let shouldRun = false;
let searchClass = null;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  console.log(request)
  getClassByType(request.type);
  shouldRun = request.toggle;
  sendResponse({ request });
});

function getClassByType(type) {
  if (type === "party") searchClass = ".pm-party-share-link";
  else if (type === "follow") searchClass = ".pm-followers-share-link";
  else searchClass = null;
}

function shuffle(arra1) {
  var ctr = arra1.length,
    temp,
    index;
  while (ctr > 0) {
    index = Math.floor(Math.random() * ctr);
    ctr--;
    temp = arra1[ctr];
    arra1[ctr] = arra1[index];
    arra1[index] = temp;
  }
  return arra1;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function startSharing() {
  let counter = 0;
  const elems = $(".share");
  elems.each(function (index, element) {
    setTimeout(() => {
      if (shouldRun && searchClass) {
        element.style.backgroundColor = "yellow";
        element.style.color = "yellow";
        element.focus();
        element.click();
        setTimeout(() => {
          const share = $(searchClass).get(0);
          console.log(share, searchClass);
          share.focus();
          share.click();
        }, getRandomInt(1500, 2000));
      }
      counter++;
      if (counter === elems.length) running = false;
    }, getRandomInt(1500, 2000) * (index + 1));
  });
}

setInterval(() => {
  if (!running && shouldRun) {
    running = true;
    startSharing();
  }
}, 1000);
