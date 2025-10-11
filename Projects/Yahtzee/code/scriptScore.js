
/*-------------------------------imports-----------------------------------*/

// const { arrayCounter } = require('./scriptGame');

/*-------------------------------variables-----------------------------------*/

let hasBonus;
let has3k;
let has4k;
let hasFH;
let hasSS;
let hasLS;
let hasYah;
let hasChance = true;


/*-------------------------------console testing-----------------------------------*/


// let arrayCounter = [1, 1, 1, 0, 0, 1];
// console.log("Counter array after roll:", arrayCounter);

// console.log(hasSmallStraight(arrayCounter));
// calculateScoreTotal();

// console.log("3 has a value of : ", scoreTop3);
// console.log("Your total score is: ", scoreTotal);

/*-------------------------------functions-----------------------------------*/


// calculates total score for the game
function calculateScoreGameTotal(tot, sub1, sub2) { tot = sub1 + sub2; }


// calcualtes total score for bot
// function calculateScoreBot() {

//     calculateFH(); 
//     calculate3k();  
//     scoreBotTotal = score3k + score4k + scoreFH + scoreSS + scoreSS; 
// }

// calculates top total
function calculateScoreTopTotal(top, sub, bonus) { top = sub + bonus; }

// function calculateScoreSubTop(subTop) {
//     calculateTop

//     subTop = score1;
// }

/* calculates top scores for values 1 - 6
This is done by simply taking the counter array and multiplying the value of the array for index x by the index + 1.
It is meant to act as a streamlined way to calculate all possible values for 1-6.
As an example, a roll with 3 3's would be [1, 0, 3, 1, 0, 0], so 3 x [2 + 1] = 9
*/
const calculateTop = (array, position) => array[position] * (position + 1); 
// function calculateTop2() { calculateIndexValue(array, 1); scoreTop2 = indexScore; }
// function calculateTop3() { calculateIndexValue(array, 2); scoreTop3 = indexScore; }
// function calculateTop4() { calculateIndexValue(array, 3); scoreTop4 = indexScore; }
// function calculateTop5() { calculateIndexValue(array, 4); scoreTop5 = indexScore; }
// function calculateTop6() { calculateIndexValue(array, 5); scoreTop6 = indexScore; }

// calculates total value of array
// function calculateRollTotal(array) {
//     let total = 0;
//     // calculates the top totals for dice values 1 - 6 and then adds them together
//     for (i = 0; i < 6; i++) { total += calculateTop(array, i); }
//     return total;
// }

// testing for kinds

function calculate345k(array) {

    rollTotal = scoreFunc.calcObjTotal(rollData.arrayRoll);

    if (scoreFunc.calculateYah(array) > 0) {
        botScores.scoreYah = scoreFunc.calculateYah(array);
        botScores.score4k = rollTotal;
        botScores.score3k = rollTotal;
    } else if (scoreFunc.has4ofak(array)) {
        botScores.score4k = rollTotal;
        botScores.score3k = rollTotal;
    } else if (scoreFunc.has3ofaK(array)) {
        botScores.score3k = rollTotal;
    }
}

// the current code used to figure out 3,4 and 5 of a kind

function calcObjTotal(obj) {
    const totalScore = Object.values(obj)
        .filter(value => typeof value === 'number')
        .reduce((sum, value) => sum + value, 0);
    return totalScore;
}

// new code 2025 used for total value of the roll

// long version

// const sumFromCounter(counter) {
//     let total = 0;
//     for (let i=0; i < counter.length; i++) {
//         total += counter[i] * (i = 1);
//     }
//     return total;
// }

// compact version

const sumFromCounter = (counter) =>
    counter.reduce((total, count, i) => total + count * (i + 1), 0);

// calculations for the bottom scores

// checks max count for array
function calculateMaxCount(array) { return Math.max(...array); }


// a 3 of a kind will have a counter array that includes a 3
// function has3ofaK(array) { return array.some(c => c >= 3)}
// // has a 4 of a kind
// function has4ofak(array) { return array.some(c => c = 4) }
// calculate full house
function calculateFH(array) { return (array.includes(2) && array.includes(3)) ? 25 : 0};
// has small straight
function calculateSS(array) {
    return ((array[0] >= 1 && array[1] >= 1 && array[2] >= 1 && array[3] >= 1) ||
        (array[1] >= 1 && array[2] >= 1 && array[3] >= 1 && array[4] >= 1) ||
        (array[2] >= 1 && array[3] >= 1 && array[4] >= 1 && array[5] >= 1)) ? 30 : 0;
}

// has a large straight
function calculateLS(array) {
    const maxCount = calculateMaxCount(array);
    return (maxCount === 1 && (array[0] === 0 || array[5] === 0)) ? 40 : 0;
}
// checks if has Yahtzee is true, calculates if it is
function calculateYah(array) { return array.includes(5) ? 50 : 0 };
// tests if top sub total gets bonus
function calcBonusTop(object) {return object >= 63 ? 35 : 0};
// calculates calcualtes Top
function calcTopTotal(object1, object2) { return (object2 = 35) ? object1 += 35 : object1 };

function calculate3k(array) { return array.some(c => c >= 3) ? sumFromCounter(array) : 0;}

function calculate4k(array) { return array.some(c => c >= 4) ? sumFromCounter(array) : 0;}

// function ca

export { calcObjTotal, sumFromCounter, calculateFH, calculateSS, calculateLS, calculateYah, calcBonusTop, calcTopTotal, calculate3k, calculate4k, calculateTop, calculateMaxCount};