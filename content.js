"use strict";

const isEmail = RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.message == "load_complete") {
    scanForEmail();
    setInterval(() => {
      scanForEmail();
    }, 5000);
  }
});

function scanForEmail() {
  $("*").each(function(key, value) {
    const elem = $(value);
    const text = elem.text();
    if (text.length > 0) {
      const email = text.replace(/<|>/g, "");
      if (isEmail.test(email)) {
        if (!elem.hasClass("copy-email-extension")) {
          elem.addClass("copy-email-extension");
          elem
            .click(function(e) {
              copyToClipboard(e.target);
              e.target.style.backgroundColor = "#008000";
              setTimeout(() => {
                e.target.style.backgroundColor = "";
              }, 1000);
            })
            .hover(
              function(e) {
                e.target.style.backgroundColor = "#FFFF00";
              },
              function(e) {
                e.target.style.backgroundColor = "";
              }
            );
        }
      }
    }
  });
}

function copyToClipboard(elem) {
  const aux = document.createElement("input");
  const text = elem.innerText;
  const email = text.replace(/<|>/g, "");
  aux.setAttribute("value", email);
  document.body.appendChild(aux);
  aux.select();
  document.execCommand("copy");
  document.body.removeChild(aux);
}
