'use strict'

const LABELS = {
  follow: { true: 'Follow Mode Active!', false: 'Toggle Follow Mode' },
  party: { true: 'Party Mode Active!', false: 'Toggle Party Mode' },
}

const buttons = {
  follow: document.getElementById('followButton'),
  party: document.getElementById('partyButton'),
}

/**
 * Updates a mode button's label and active CSS class to reflect the current
 * toggle state received from the content script.
 *
 * @param {'follow' | 'party'} type - The mode whose button should be updated.
 * @param {boolean} toggle - Whether the mode is now active.
 * @returns {void}
 */
const toggleActive = (type, toggle) => {
  const btn = buttons[type]
  btn.textContent = LABELS[type][toggle]
  btn.classList.toggle('pure-button-active', toggle)
}

/**
 * Sends a message to the content script running in the active tab and
 * updates both mode buttons with the state returned in the response.
 *
 * @param {{ type: string | null }} message - The message payload. `type` is
 *   `'follow'`, `'party'`, or `null` (to query current state without toggling).
 * @returns {void}
 */
const sendMessage = (message) => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) return
    chrome.tabs.sendMessage(tabs[0].id, message, (response) => {
      if (!response) return
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
