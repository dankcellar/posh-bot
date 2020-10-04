'use strict'

let checkerInterval = null
let lastCount = 0
let goodChecks = 0
// let activeIntervals = []

const DATA = {
  follow: {
    toggle: false,
    loops: 1,
  },
  party: {
    toggle: false,
    loops: 1,
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

// const createCounter = (elem) => {
//   const countElem = elem.closest('span.count')
//   if (countElem.length > 0) {
//     countElem.text(`${i + 1}`)
//   } else {
//     const countElem = $('<span class="count">0</span>')
//     countElem.insertAfter(element)
//   }
// }

const getLoops = () => {
  if (DATA.follow.toggle) return DATA.follow.loops
  if (DATA.party.toggle) return DATA.party.loops
  return 0
}

const searchClass = () => {
  if (DATA.follow.toggle) {
    const share = $('.modal a').get(0)
    return $(share).find('div').first()
  }
  if (DATA.party.toggle) {
    const share = $('.modal a').get(1)
    return $(share).find('div').first()
  }
  return null
}

const startSharing = (_elems) => {
  console.info('SHARING STARTED')
  let total = 0
  let counter = 0
  const elems = DATA.follow.toggle ? shuffle(_elems) : _elems
  elems.each((index, _element) => {
    const element = $(_element).closest('div[class*="col"]').find('i').last()
    for (let i = 0; i < getLoops(); ++i) {
      // activeIntervals.push(
      setTimeout(() => {
        if (DATA.follow.toggle || DATA.party.toggle) {
          element.css('backgroundColor', 'yellow')
          element.get(0).click()
          // activeIntervals.push(
          setTimeout(() => {
            const share = searchClass()
            console.info('STATUS', total, counter, counter === total - 1 && DATA.party.toggle)
            if (share.length > 0) {
              share.get(0).click()
              if (counter === total - 1 && DATA.party.toggle) {
                startSharing(_elems)
              }
            }
            ++counter
          }, 1500)
          // )
        }
      }, 3000 * ++total)
      // )
    }
  })
}

const startInterval = () => {
  lastCount = 0
  goodChecks = 0

  const radioToggle = $('input[value*="available"]')
  radioToggle.get(0).click()

  checkerInterval = setInterval(() => {
    const elems = $('a[href*="/listing/"] img')

    if (lastCount === elems.length) ++goodChecks
    else elems.last().get(0).scrollIntoView()

    if (goodChecks === 2) {
      clearInterval(checkerInterval)
      startSharing(elems)
    }
    lastCount = elems.length
  }, 2500)
}
