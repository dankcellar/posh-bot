'use strict'

let checkerInterval = null
let lastCount = 0
let goodChecks = 0

const DATA = {
  follow: {
    toggle: false,
    search: '[data-et-name="share_poshmark"]',
    loops: 1,
  },
  party: {
    toggle: false,
    search: '[data-et-name="share_poshmark_poshparty"]',
    loops: 10,
  },
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension')
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

const shuffle = (array) => {
  var currentIndex = array.length
  var temporaryValue, randomIndex
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex--)
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }
  return array
}

const createCounter = (elem) => {
  const countElem = elem.closest('span.count')
  if (countElem.length > 0) {
    // countElem.text(`${i + 1}`)
  } else {
    const countElem = $('<span class="count">0</span>')
    countElem.insertAfter(element)
  }
}

const getLoops = () => {
  if (DATA.follow.toggle) return DATA.follow.loops
  if (DATA.party.toggle) return DATA.party.loops
  return 0
}

const searchClass = () => {
  if (DATA.follow.toggle) return $(DATA.follow.search)
  if (DATA.party.toggle) return $(DATA.party.search)
  return null
}

const startSharing = (_elems) => {
  let total = 0
  let counter = 0
  const elems = DATA.party.toggle ? shuffle(_elems) : _elems
  elems.each((index, element) => {
    for (let i = 0; i < getLoops(); ++i) {
      setTimeout(() => {
        if (DATA.follow.toggle || DATA.party.toggle) {
          scrollToElement(element)
          element.click()
          setTimeout(() => {
            const share = searchClass()
            if (share) {
              share.get(0).click()
              if (total === counter++) {
                startSharing(_elems)
              }
            }
          }, 2500)
        }
      }, 2500 * ++total)
    }
  })
}

const startInterval = () => {
  lastCount = 0
  goodChecks = 0

  const radioToggle = $('[data-et-name="availability"]')[1]
  radioToggle.click()

  checkerInterval = setInterval(() => {
    const elems = $('[data-et-name="share"')
    if (lastCount === elems.length) ++goodChecks
    else scrollToElement(elems.last())

    if (goodChecks === 2) {
      clearInterval(checkerInterval)
      startSharing(elems)
    }
    lastCount = elems.length
  }, 2500)
}

const scrollToElement = (elem) => {
  elem.get(0).scrollIntoView()
}
