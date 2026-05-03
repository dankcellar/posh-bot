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

const shuffle = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

const getLoops = () => {
  if (DATA.follow.toggle) return DATA.follow.loops
  if (DATA.party.toggle) return DATA.party.loops
  return 0
}

const searchClass = () => {
  const links = document.querySelectorAll('.modal a')
  const share = DATA.follow.toggle ? links[0] : DATA.party.toggle ? links[1] : null
  return share?.querySelector('div') ?? null
}

const startSharing = (_elems) => {
  let total = 0
  let counter = 0
  const elems = DATA.follow.toggle ? shuffle([..._elems]) : _elems
  elems.forEach((_element) => {
    const col = _element.closest('div[class*="col"]')
    const iElems = col.querySelectorAll('i')
    const element = iElems[iElems.length - 1]
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

const startInterval = () => {
  lastCount = 0
  goodChecks = 0
  document.querySelector('input[value*="available"]')?.click()
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
