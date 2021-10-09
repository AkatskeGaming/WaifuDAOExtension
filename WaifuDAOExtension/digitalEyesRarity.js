
let waifuMap = new Map();

function getTraitValue(trait, traitName) {
  return Dictionary[trait].filter(entry => entry.text == traitName)[0].value
}

function parseTraits(traits) {
  let waifuTraits = {
    Shades: 99,
    Hair: 1,
    Eyes: 1,
    Mouth: 1,
    Outfit: 1,
    Skin: 1,
    Background: 1,
    Rarity: 0,
    Rating: ""
  }

  traits.forEach(trait => {
    let traitName = trait.trait_type
    waifuTraits[traitName] = getTraitValue(traitName, trait.value)
  })

  return waifuTraits
}

function parseWaifus() {
  if (waifuMap.size == 0) return

  waifuMap.forEach(waifu => {
    if(waifu.Rarity == 0) {
      let discriminant = calculateDiscriminant(
        waifu.Shades,
        waifu.Hair,
        waifu.Eyes,
        waifu.Mouth,
        waifu.Outfit,
        waifu.Skin,
        waifu.Background)

      waifu.Rarity = calculateRarity(discriminant)

      waifu.Rating = getRating(waifu.Rarity)
    }
  })
}

const marketListingUrl = "https://us-central1-digitaleyes-prod.cloudfunctions.net" +
  "/offers-retriever?collection=Waifu%20DAO%20Gaming%20Guild"

let cursor = ""

function showRarity() {
  if (waifuMap.size == 0 || cursor != null) return

  waifuMap.forEach((waifu, name, map) => {
    const xpath = "//p[text()='" + name + "']"
    let matchingElement = document.evaluate(xpath, document, null, 
      XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue
    
    if (matchingElement != undefined) {
      matchingElement.innerText = matchingElement.innerText + " Rarity " + waifu.Rarity
      matchingElement.classList.add('rarity-' + waifu.Rating)
    }
  })
}

function parseResponse(response) {
  cursor = response.next_cursor
  return response.offers.forEach(offer => {
    if (waifuMap.get(offer.metadata.name) == undefined) {
      waifuMap.set(offer.metadata.name, parseTraits(offer.metadata.attributes))
    }
  })
}

async function retrieveWaifus() {

  do {
    
    let url = ""
    // Every request returns a cursor which is used to fetch the next 20 Waifus,
    // so we loop untill every waifu in the marketplace is returned.
    if (cursor == "") {
      url = marketListingUrl
    } else {
      url = marketListingUrl + "&cursor=" + cursor
    }

    const fetchPromise = fetch(url)

    await fetchPromise.then((res) => {
      return res.json();
    }).then((json) => {
      return parseResponse(json)
    })

  } while (cursor != null)

  parseWaifus()
}

retrieveWaifus()

setInterval(showRarity, 3000)

