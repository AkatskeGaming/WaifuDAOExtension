/**
 * Loop over the Waifu mints data, attempt to find them in the document and then append their rarity and ranks.
 */
function showRanking() {
  let matchingElements = document.evaluate("//h6[contains(text(),'Waifu #')]", document, null, XPathResult.ANY_TYPE, null);

  let node, nodes = []
  while (node = matchingElements.iterateNext()) {
    nodes.push(node)
  }

  nodes.forEach((element) => {
    const waifuNumber = element.innerText.substring(7)
    let waifu = Mints[waifuNumber]
    if (waifu != undefined) {
      let rarity = calculateRarity(waifu.rarity)
      element.innerHTML = "Waifu  #" + waifuNumber + " R " + rarity + " MR " + waifu.rank
      element.classList.add('rarity-me-' + getRating(rarity)) 
    }
  })

}


/**
 * This is important because we are not keeping track of what the user is doing on the browser.
 * The digital eyes marketplace works by first fetching 20 waifus and displaying them and
 * as the user scrolls down the screen, sends a subsequent request to retrieve the next set of waifus.
 * There is also filtering to consider which would change the request being done completely. In this case
 * the idea behind this script is to fetch all the Waifus and keep checking untill the waifu has been
 * rendered on the page and then add its rarity to it's html element. We cannot remove any waifu from the list
 * because when filtering the same waifu might reappear and need to have its rarity appended again.
 */
setInterval(showRanking, 5000)

