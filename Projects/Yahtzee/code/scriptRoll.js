
/*-----------------------------------imports--------------------------------------*/

// left these here, but it works without them
//const { arrayChoice } = require('./scriptGame');
//const { rollData, scoreData } = require('./scriptGame');



/*-------------------------------console testing-----------------------------------*/


/*----------------------------------functions 2025 version-----------------------------------------*/


const DICE_COUNT = 5;
const DICE_SIDES = 6;

const getDiceNumber = () => Math.floor(Math.random() * DICE_SIDES) + 1;

const rollFullPure = (len = DICE_COUNT) =>
  Array.from({ length: len }, () => getDiceNumber());

const reRollPure = (arr) =>
  arr.map(v => (v === 0 ? 0 : getDiceNumber()));

/*----------------------------------functions-----------------------------------------*/

// // gets random number used to get dice
// function getDiceNumber() {
//     return Math.floor(Math.random() * 6) + 1;
// }

// // does a complete new roll of an array
// function rollFull(array) {
//     for (let i = 0; i < 5; i++) {   
//         let diceRoll = getDiceNumber();
//         array[i] = diceRoll;
//     }
// }

// // not implemented yet
// // does a re-roll by only rolling the values of an array that are not equal to 0.
// function reRoll(array) {
//     for (let i = 0; i < 5; i++) {   
//         let diceRoll = getDiceNumber();
//         !(array[i] === 0) ? array[i] = diceRoll : 0;
//     }
// }

// // clears an array
// function clearArray(array) { for (let i = 0; i < array.length; i++) { !(array[i] === 0) ? array[i] = 0 : 0;}}

// // updates the Counter Array to see how many times each face is rolled. Refer to scriptGame for details.
// function getArrayCounter(array1, array2) {

//     array2.fill(0); // resets the counter to 0 for each new roll

//     array1.forEach(value => {
//         if (value 

export { rollFullPure, reRollPure, getDiceNumber };