export default function isSelectedCardValid(card: CardData, currentCard: CardData) {
  let match = false;
  currentCard?.types?.forEach((currentType) => {
    card?.types?.forEach((myType) => {
      console.log(currentType, myType);
      if (myType === currentType) {
        match = true;
        return;
      }
    });
  });
  if (card.hp >= currentCard.hp) {
    match = true;
  }

  return match;
}
