"use strict";

let checkerInterval = null;
let shouldRun = false;
let searchClass = null;
let lastCount = 0;
let goodChecks = 0;

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  // console.log(
  //   sender.tab
  //     ? "from a content script:" + sender.tab.url
  //     : "from the extension"
  // );
  console.log(request);

  shouldRun = request.toggle;
  if (request.type === "party") {
    searchClass = ".pm-party-share-link";
  } else if (request.type === "follow") {
    searchClass = ".pm-followers-share-link";
  } else {
    searchClass = null;
  }

  if (shouldRun) {
    startInterval();
  } else {
    clearInterval(checkerInterval);
  }

  sendResponse({ request });
});

// function shuffle(arra1) {
//   var ctr = arra1.length,
//     temp,
//     index;
//   while (ctr > 0) {
//     index = Math.floor(Math.random() * ctr);
//     ctr--;
//     temp = arra1[ctr];
//     arra1[ctr] = arra1[index];
//     arra1[index] = temp;
//   }
//   return arra1;
// }

// function getRandomInt(min, max) {
//   // The maximum is exclusive and the minimum is inclusive
//   min = Math.ceil(min);
//   max = Math.floor(max);
//   return Math.floor(Math.random() * (max - min)) + min;
// }

function startSharing(elems) {
  // const elems = $(".share");
  elems.each(function (index, element) {
    setTimeout(() => {
      if (shouldRun && searchClass) {
        element.style.backgroundColor = "yellow";
        element.style.color = "yellow";
        element.focus();
        element.click();
        setTimeout(() => {
          //console.log(index, shouldRun, searchClass);
          if (shouldRun && searchClass) {
            const share = $(searchClass);
            if (share) {
              const htmlElem = share.get(0);
              htmlElem.focus();
              htmlElem.click();
            }
          }
        }, 2500);
      }
    }, 2500);
  });
}

function startInterval() {
  lastCount = 0;
  goodChecks = 0;

  const radioToggle = $("#availability-available");
  if (!radioToggle.prop("checked")) radioToggle.get(0).click();

  checkerInterval = setInterval(() => {
    const elems = $(".share");
    if (lastCount === elems.length) {
      goodChecks += 1;
    } else {
      scrollToElement(elems.last());
    }
    if (goodChecks === 5) {
      clearInterval(checkerInterval);
      startSharing(elems);
    }
    lastCount = elems.length;
  }, 2500);
}

function scrollToElement(element) {
  const htmlElem = element.get(0);
  htmlElem.scrollIntoView();
}
