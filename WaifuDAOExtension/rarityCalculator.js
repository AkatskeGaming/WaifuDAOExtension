const Dictionary = {
  Shades: [
    {value: 99, text: "No Shades"},
    {value: 0.75, text: "Solana Vipers"},
    {value: 0.25, text: "Sunset Vipers"}
  ], 
  Hair: [
    {value: 11, text: "Blonde Deviant"},
    {value: 11, text: "Blue Solana Cap"},
    {value: 6, text: "Orange Pirate"},
    {value: 6, text: "Purple Pirate"},
    {value: 11, text: "Blue Amazon"},
    {value: 6, text: "Blue Maid"},
    {value: 6, text: "Red Maid"},
    {value: 11, text: "Geisha"},
    {value: 10, text: "Red and Black Horns"},
    {value: 6, text: "Silver Halo"},
    {value: 6, text: "Golden Halo"},
    {value: 10, text: "Anime Cat Girl"}
  ], 
  Eyes: [
    {value: 15, text: "Purple"},
    {value: 15, text: "Pink"},
    {value: 10, text: "Red"},
    {value: 15, text: "Aqua"},
    {value: 10, text: "Blue"},
    {value: 15, text: "Lime"},
    {value: 5, text: "Dark Red"},
    {value: 5, text: "Green"},
    {value: 5, text: "Shadow"},
    {value: 5, text: "Gold"}
  ],
  Mouth: [
    {value: 25, text: "Soft Smile"},
    {value: 50, text: "Smile"},
    {value: 25, text: "Degenerate"}
  ],
  Outfit: [
    {value: 9, text: "Solana Degen Hoodie"},
    {value: 9, text: "Pirate"},
    {value: 9, text: "Amazon Warrior"},
    {value: 9, text: "Maid"},
    {value: 9, text: "Kimono"},
    {value: 6, text: "Summer Dress"},
    {value: 6, text: "Adventurer"},
    {value: 2, text: "Shadow Engulfed (Purple)"},
    {value: 9, text: "Shadow Engulfed (Blue)"},
    {value: 9, text: "Archangel"},
    {value: 7, text: "Cadet"},
    {value: 8, text: "Cyborg"},
    {value: 8, text: "Nurse"}
  ],
  Skin: [
    {value: 15, text: "Porcelain"},
    {value: 14, text: "Ivory"},
    {value: 14, text: "Beige"},
    {value: 14, text: "Natural"},
    {value: 14, text: "Honey"},
    {value: 14, text: "Chestnut"},
    {value: 14, text: "Espresso"},
    {value: 0.5, text: "Celestial"},
    {value: 0.5, text: "Invisible"}
  ],
  Background: [
    {value: 2, text: "Golden Edition"},
    {value: 10, text: "Green"},
    {value: 11, text: "Aqua"},
    {value: 11, text: "Blue"},
    {value: 11, text: "Orange"},
    {value: 11, text: "Red"},
    {value: 11, text: "Noir"},
    {value: 11, text: "Iris"},
    {value: 11, text: "Purple"},
    {value: 11, text: "Pink"}
  ]
}

function createTraitSelect(element, traits) {
  for(var i = 0; i < traits.length; i++) {
      var opt = traits[i]
      var el = document.createElement("option")
      el.textContent = opt.text
      el.value = opt.value
      element.appendChild(el)
  }
}

function calculateDiscriminant(shades, hair, mouth, 
  eyes, outfit, skin, background) {

  let discriminant = 1

  discriminant *= shades / 100
  discriminant *= hair / 100
  discriminant *= mouth / 100
  discriminant *= eyes / 100
  discriminant *= outfit / 100
  discriminant *= skin / 100
  discriminant *= background / 100

  return discriminant
}


function calculateRarity(discriminant) {
  return Math.round((1/discriminant/10000) - (82/1000)+15)
}

function getRating(rarity) {
  let rating = "undefined"

  if (rarity < 45){
    rating = "Common"
  }
  else if (rarity < 100){
    rating = "Uncommon";
  }
  else if (rarity < 220){
    rating = "Rare";
  }
  else if (rarity < 1000){
    rating = "Epic";
  }
  else if (rarity < 10000){
    rating = "Legendary";
  }
  else {
    rating = "Mythic";
  }

  return rating
}

