"use strict";

let running = false;
let shouldRun = false;

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  console.log(
    sender.tab
      ? "from a content script:" + sender.tab.url
      : "from the extension"
  );
  if (request.type === "toggle") {
    shouldRun = !shouldRun;
    sendResponse({ shouldRun });
  }
});

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
  elems.each(function(index, element) {
    setTimeout(() => {
      element.focus();
      element.style.backgroundColor = "yellow";
      element.style.color = "yellow";
      // element.innerText = 'Helll'
      element.click();
      setTimeout(() => {
        const share = $(".pm-followers-share-link").get(0);
        console.log(share);
        share.focus();
        share.click();
      }, getRandomInt(750, 1250));
      counter++;
    }, getRandomInt(2000, 3000) * (index + 1));
  });

  const interval = setInterval(() => {
    if (counter === elems.length) running = false;
    if (!running) clearInterval(interval);
  });
}

setInterval(() => {
  if (!running && shouldRun) {
    running = true;
    startSharing();
  }
}, 1000);
