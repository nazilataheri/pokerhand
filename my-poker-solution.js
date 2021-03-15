const lineReader = require('line-reader');

const pokerHand = () => {
  let player1won = 0,
    player2won = 0;
  const order = '23456789TJQKA';

  //Read text file line by line, at the end line, last will be true and print the result
  lineReader.eachLine('poker-hands.txt', (line, last) => {
    let hand1 = line.substring(0, 14);
    let hand2 = line.substring(15);
    compareHands(hand1, hand2);
    if (last) {
      console.log('Player1: ' + player1won);
      console.log('Player2: ' + player2won);
    }
  });

  const compareHands = (hand1, hand2) => {
    let details1 = getHandDetails(hand1);
    let details2 = getHandDetails(hand2);
    if (details1.rank === details2.rank) {
      if (details1.value < details2.value) {
        return player1won++;
      } else if (details1.value > details2.value) {
        return player2won++;
      }
      return 0;
    }
    return details1.rank > details2.rank ? player1won++ : player2won++;
  };

  const getHandDetails = (hand) => {
    const cards = hand.split(' ');
    //Convert face into something that is sortable
    const faces = cards.map((face) =>
      String.fromCharCode([77 - order.indexOf(face[0])])
    );
    faces.sort();
    const suits = cards.map((suit) => suit[1]);
    suits.sort();
    const counts = faces.reduce(count, {});
    const duplicates = Object.values(counts).reduce(count, {});
    const flush = suits[0] === suits[4];
    const first = faces[0].charCodeAt(0);
    const straight = faces.every(
      (face, index) => face.charCodeAt(0) - first === index
    );
    const royal = faces.every(
      (face, index) => face.charCodeAt(0) - 65 === index
    );
    let rank =
      (royal && flush && 10) ||
      (flush && straight && 9) ||
      (duplicates[4] && 8) ||
      (duplicates[3] && duplicates[2] && 7) ||
      (flush && 6) ||
      (straight && 5) ||
      (duplicates[3] && 4) ||
      (duplicates[2] > 1 && 3) ||
      (duplicates[2] && 2) ||
      1;

    let value = faces.sort(byCountFirst).join('');
    return { rank, value };

    //we need to sort by count and then by face value in our output string
    function byCountFirst(a, b) {
      //Counts are in reverse order - bigger is better
      const countDiff = counts[b] - counts[a];
      if (countDiff) return countDiff; // If counts don't match return
      return b > a ? -1 : b === a ? 0 : 1;
    }
  };

  //create a lookup to find duplicates
  const count = (c, val) => {
    c[val] = (c[val] || 0) + 1;
    return c;
  };
};
pokerHand();
