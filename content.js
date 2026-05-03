'use strict'

let checkerInterval = null
let lastCount = 0
let goodChecks = 0

const DATA = {
  follow: { toggle: false, loops: 1 },
  party: { toggle: false, loops: 10 },
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'follow') {
    DATA.follow.toggle = !DATA.follow.toggle
    DATA.party.toggle = false
  }
  if (request.type === 'party') {
    DATA.follow.toggle = false
    DATA.party.toggle = !DATA.party.toggle
  }
  sendResponse({ follow: DATA.follow.toggle, party: DATA.party.toggle })
  if (request.type) {
    if (DATA.follow.toggle || DATA.party.toggle) startInterval()
    else clearInterval(checkerInterval)
  }
})

/**
 * Returns a new array with the same elements in a randomly shuffled order.
 * The original array is not mutated.
 *
 * @param {Array} array - The source array to shuffle.
 * @returns {Array} A new array containing all elements in random order.
 */
const shuffle = (array) => {
  const result = [...array]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * Returns the number of share loops to perform based on the active mode.
 * Follow mode loops once; party mode loops 10 times.
 *
 * @returns {number} The loop count for the currently active mode, or 0 if
 *   neither mode is active.
 */
const getLoops = () => {
  if (DATA.follow.toggle) return DATA.follow.loops
  if (DATA.party.toggle) return DATA.party.loops
  return 0
}

/**
 * Locates the share target anchor element within the open share modal.
 *
 * - Follow mode: selects the "To My Followers" link via its unique
 *   `data-et-name="share_poshmark"` attribute.
 * - Party mode: selects the active Posh Party link via its unique
 *   `data-et-name="share_to_party"` attribute.
 *
 * Returns the first child `<div>` of the anchor (the element that must
 * be clicked to trigger the share), or `null` if the modal is not present.
 *
 * @returns {HTMLElement | null} The clickable div inside the share anchor,
 *   or null if the share target could not be found.
 */
const searchClass = () => {
  if (DATA.follow.toggle) {
    const anchor = document.querySelector('a[data-et-name="share_poshmark"]')
    if (!anchor) return null
    return anchor.querySelector('div')
  }
  if (DATA.party.toggle) {
    const anchor = document.querySelector('a[data-et-name="share_to_party"]')
    if (!anchor) return null
    return anchor.querySelector('div')
  }
  return null
}

/**
 * Iterates over each listing image element and triggers the share flow for
 * each one. In follow mode the list is shuffled before processing. In party
 * mode the loop restarts automatically after the last listing is shared.
 *
 * Each listing share is staggered by 3 seconds to avoid rate-limiting, and
 * the modal click is delayed by 1.5 seconds to allow the share modal to open.
 *
 * @param {Element[]} _elems - Array of listing `<img>` elements to share.
 * @returns {void}
 */
const startSharing = (_elems) => {
  let total = 0
  let counter = 0
  const elems = DATA.follow.toggle ? shuffle(_elems) : _elems
  elems.forEach((_element) => {
    const col = _element.closest('div[class*="col"]')
    if (!col) return
    const element = col.querySelector('div[data-et-name="share"]')
    if (!element) return
    for (let i = 0; i < getLoops(); ++i) {
      setTimeout(() => {
        if (DATA.follow.toggle || DATA.party.toggle) {
          element.style.backgroundColor = 'yellow'
          element.click()
          setTimeout(() => {
            const share = searchClass()
            if (share) {
              share.click()
              if (counter + 1 === total && DATA.party.toggle) startSharing(_elems)
            }
            ++counter
          }, 1500)
        }
      }, 3000 * ++total)
    }
  })
}

/**
 * Begins the scroll-and-wait loop that ensures all listing images are loaded
 * before sharing starts. Clicks the "available" filter if present, then polls
 * every 2.5 seconds. Once the image count stabilises across two consecutive
 * checks, it stops the interval and calls `startSharing`.
 *
 * @returns {void}
 */
const startInterval = () => {
  lastCount = 0
  goodChecks = 0
  const availableInput = document.querySelector('input[value*="available"]')
  if (availableInput) availableInput.click()
  checkerInterval = setInterval(() => {
    const elems = document.querySelectorAll('a[href*="/listing/"] img')
    if (lastCount === elems.length) ++goodChecks
    else elems[elems.length - 1].scrollIntoView()
    if (goodChecks === 2) {
      clearInterval(checkerInterval)
      startSharing(Array.from(elems))
    }
    lastCount = elems.length
  }, 2500)
}
