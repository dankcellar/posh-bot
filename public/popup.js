'use strict'

const DATA = {
  follow: {
    true: 'Follow Mode Active!',
    false: 'Toggle Follow Mode',
    button: $('#followButton'),
  },
  party: {
    true: 'Party Mode Active!',
    false: 'Toggle Party Mode',
    button: $('#partyButton'),
  },
}

const toggleActive = (type, toggle) => {
  const elem = DATA[type].button
  elem.text(DATA[type][toggle])
  if (toggle) elem.addClass('pure-button-active')
  else elem.removeClass('pure-button-active')
}

const sendMessage = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      const { follow, party } = response
      toggleActive('follow', follow)
      toggleActive('party', party)
    })
  })
}

DATA.follow.button.on('click', (event) => {
  event.preventDefault()
  sendMessage({ type: 'follow' })
})

DATA.party.button.on('click', (event) => {
  event.preventDefault()
  sendMessage({ type: 'party' })
})

const version = chrome.runtime.getManifest().version
const versionText = $('#versionText').text(`Version: ${version}`)
sendMessage({ type: null })
