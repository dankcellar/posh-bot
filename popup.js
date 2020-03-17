function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    console.log(tabs);
    chrome.tabs.sendMessage(tabs[0].id, message, function(response) {
      console.log(response);
    });
  });
}

const startButton = $("#startButton");
const stopButon = $("#stopButton");

startButton.show();
stopButon.hide();

startButton.on("click", function() {
  // const value = $("#countInput").val()
  startButton.hide();
  stopButon.show();
  sendMessage({ type: "toggle" });
});

stopButon.on("click", function() {
  startButton.show();
  stopButon.hide();
  sendMessage({ type: "toggle" });
});
