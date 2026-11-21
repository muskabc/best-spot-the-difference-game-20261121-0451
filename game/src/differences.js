// differences.js — what differs between the two panels of each scene.
// Each difference is a circle in panel coordinates (560 x 400): a click inside
// it, on either panel, finds it. The label is what the game tells the player
// after a find; the hint is what the hint button whispers.

export const SCENES = [
  {
    id: 'cafe',
    name: 'The Corner Café',
    subtitle: 'A quiet morning, coffee on the table.',
    timeLimit: 180,
    differences: [
      { id: 'bird', x: 150, y: 82, r: 26, label: 'The bird by the window', hint: 'Something small flew in through the window.' },
      { id: 'cat', x: 205, y: 195, r: 30, label: 'The cat on the sill', hint: 'A warm spot by the window is empty.' },
      { id: 'clock', x: 452, y: 78, r: 38, label: 'The clock hands', hint: 'Time moved on in one picture.' },
      { id: 'picture', x: 370, y: 155, r: 40, label: 'The framed picture', hint: 'The art on the wall changed its subject.' },
      { id: 'lamp', x: 300, y: 78, r: 34, label: 'The hanging lamp', hint: 'One room is lit, the other is not.' },
      { id: 'flowers', x: 470, y: 245, r: 30, label: 'The vase of flowers', hint: 'The flowers changed colour.' },
      { id: 'steam', x: 120, y: 238, r: 26, label: 'The coffee steam', hint: 'One cup is hot, the other has gone cold.' },
      { id: 'cookies', x: 380, y: 278, r: 30, label: 'The cookies', hint: 'Someone took a cookie from the plate.' },
    ],
  },
  {
    id: 'park',
    name: 'The Park at Dusk',
    subtitle: 'The light is fading — look closely.',
    timeLimit: 150,
    differences: [
      { id: 'kite', x: 300, y: 70, r: 30, label: 'The kite in the sky', hint: 'Something is flying above the path.' },
      { id: 'ducks', x: 420, y: 335, r: 34, label: 'The ducks on the pond', hint: 'Count the ducks on the pond.' },
      { id: 'lamp', x: 484, y: 165, r: 30, label: 'The lamppost', hint: 'One lamppost is lit, the other is dark.' },
      { id: 'cushion', x: 270, y: 261, r: 32, label: 'The bench cushion', hint: 'The bench cushion changed colour.' },
      { id: 'flowers', x: 110, y: 358, r: 34, label: 'The tulips', hint: 'The flower bed changed colour.' },
      { id: 'basket', x: 162, y: 262, r: 28, label: 'The bicycle basket', hint: 'The bicycle is missing something.' },
      { id: 'ball', x: 424, y: 306, r: 24, label: 'The dog’s ball', hint: 'The dog’s toy changed colour.' },
      { id: 'butterfly', x: 210, y: 340, r: 24, label: 'The butterfly', hint: 'Something fluttered away from the grass.' },
    ],
  },
];

export function sceneById(id) {
  return SCENES.find((scene) => scene.id === id) ?? SCENES[0];
}

// The right panel carries every difference; the left panel carries none.
export function alteredSet(scene) {
  return new Set(scene.differences.map((d) => d.id));
}
