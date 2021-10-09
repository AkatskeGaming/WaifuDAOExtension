let submitButton = document.getElementById("submitButton")
let result = document.getElementById("result")
let ratingSpan = document.getElementById("rating")
let selectShades = document.getElementById("selectShades")
let selectHair = document.getElementById("selectHair")
let selectEyes = document.getElementById("selectEyes")
let selectMouth = document.getElementById("selectMouth")
let selectOutfit = document.getElementById("selectOutfit")
let selectSkin = document.getElementById("selectSkin")
let selectBackground = document.getElementById("selectBackground")

submitButton.addEventListener("click", async () => {

  const discriminant = calculateDiscriminant(
  selectShades.value,
  selectHair.value,
  selectEyes.value,
  selectMouth.value,
  selectOutfit.value,
  selectSkin.value,
  selectBackground.value)

  const rarity = calculateRarity(discriminant)

  const rating = getRating(rarity)


  result.innerHTML = "With a rarity of " + rarity + " your waifu is "
  ratingSpan.innerHTML = rating
  ratingSpan.classList.add('rarity-' + rating)
})

createTraitSelect(selectShades, Dictionary["Shades"])
createTraitSelect(selectHair, Dictionary["Hair"])
createTraitSelect(selectEyes, Dictionary["Eyes"])
createTraitSelect(selectMouth, Dictionary["Mouth"])
createTraitSelect(selectOutfit, Dictionary["Outfit"])
createTraitSelect(selectSkin, Dictionary["Skin"])
createTraitSelect(selectBackground, Dictionary["Background"])