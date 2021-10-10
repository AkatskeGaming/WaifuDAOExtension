/**
 * Get a specific Trait drop rate from the Trait Dictionary.
 * 
 * @param {string} trait - The trait category to look up from the Dictionary.
 * @param {string} traitName - The name of the trait to retrieve the value for.
 *
 * @return {number} The drop rate of the specific trait from the trait Dictionary.
 */
function getTraitValue(trait, traitName) {
  return Dictionary[trait].filter(entry => entry.text == traitName)[0].value
}

/**
 * Parse a Waifus metadata and retrieve each of it's traits drop rates form the Dictionary.
 * Each droprate is stored inside an object to be later used for rarity calculation.
 * 
 * @param {string} traits - The list of traits of a Waifu obtained from the request.
 *
 * @return {object} An object containing all the trait drop rates of a waifu which will then be stored in the map.
 */
function parseTraits(traits) {
  let waifuTraits = {
    // Shades is defaulted to 99 because it is the Trait value of 'No Shades'.
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

// Map that will store all the waifus returned from the api.
let waifuMap = new Map();

/**
 * Once all the Waifus have been retrieved from the api requests and the Waifu Map has been populated, we can
 * loop over every Waifu in the map. Each waifu will have its discriminant calulcated which is then used to
 * calculate the rarity and rariting which are then stored in the waifu object.
 */
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

/**
 * Instead of pagination the api returns a cursor which can be appended to a request to retrieve
 * the next set of 20 entries.
 */
let cursor = ""

/**
 * Once all the requests have been made and the waifu map populated, we can start looking for Waifus
 * in the document by matching the Waifu Name, and then appending the Rarity and adding the rarity class to it.
 * Once the rarity is added the waifu will not be matched anymore as the text no longer matches.
 */
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

/**
 * Once all the requests have been made and the waifu map populated, we can start looking for Waifus
 * in the document by matching the Waifu Name, and then appending the Rarity and adding the rarity class to it.
 * Once the rarity is added the waifu will not be matched anymore as the text no longer matches.
 */
function parseResponse(response) {
  cursor = response.next_cursor
  return response.offers.forEach(offer => {
    if (waifuMap.get(offer.metadata.name) == undefined) {
      waifuMap.set(offer.metadata.name, parseTraits(offer.metadata.attributes))
    }
  })
}

/**
 * Fetch all the waifus currently listed by calling the marketplace api and looping untill all waifus are retrieved.
 * Once all waifus are retrieved and the map is built we can then parse each waifu and calculate its values.
 */
async function retrieveWaifus() {
  do {
    // This is the Digital Eyes Waifu Market Place api without any filtering applied.
    let marketListingUrl = "https://us-central1-digitaleyes-prod.cloudfunctions.net" +
      "/offers-retriever?collection=Waifu%20DAO%20Gaming%20Guild"

    // Every request returns a cursor which is used to fetch the next 20 Waifus,
    // so we loop untill every waifu in the marketplace is returned.
    // we have to retrieve them all because of possible filtering done by user.
    if (cursor != "") { 
      marketListingUrl = marketListingUrl + "&cursor=" + cursor
    }

    const fetchPromise = fetch(marketListingUrl)

    await fetchPromise.then((res) => {
      return res.json();
    }).then((json) => {
      return parseResponse(json)
    }).catch(err => {
      console.log(err)
    });

    // Keep looping untill the cursor is set to null which means we have retrieved all the available listings.
  } while (cursor != null)

  // At this stage all requests would have completed and we can parse all the waifus at one go.
  parseWaifus()
}

// Invoke the function that will start everything.
retrieveWaifus()

/**
 * This is important because we are not keeping track of what the user is doing on the browser.
 * The digital eyes marketplace works by first fetching 20 waifus and displaying them and
 * as the user scrolls down the screen, sends a subsequent request to retrieve the next set of waifus.
 * There is also filtering to consider which would change the request being done completely. In this case
 * the idea behind this script is to fetch all the Waifus and keep checking untill the waifu has been
 * rendered on the page and then add its rarity to it's html element. We cannot remove any waifu from the list
 * because when filtering the same waifu might reappear and need to have its rarity appended again.
 */
setInterval(showRarity, 3000)

