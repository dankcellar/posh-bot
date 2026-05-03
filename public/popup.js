'use strict'

const LABELS = {
  follow: { true: 'Follow Mode Active!', false: 'Toggle Follow Mode' },
  party: { true: 'Party Mode Active!', false: 'Toggle Party Mode' },
}

const buttons = {
  follow: document.getElementById('followButton'),
  party: document.getElementById('partyButton'),
}

const toggleActive = (type, toggle) => {
  const btn = buttons[type]
  btn.textContent = LABELS[type][toggle]
  btn.classList.toggle('pure-button-active', toggle)
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

buttons.follow.addEventListener('click', (event) => {
  event.preventDefault()
  sendMessage({ type: 'follow' })
})

buttons.party.addEventListener('click', (event) => {
  event.preventDefault()
  sendMessage({ type: 'party' })
})

document.getElementById('versionText').textContent = `Version: ${chrome.runtime.getManifest().version}`
sendMessage({ type: null })
