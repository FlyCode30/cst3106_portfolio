// this file is used to test the roll and scoring logic

// imports rolling logic
import { rollFullPure, reRollPure, getArrayCounterPure } from './scriptRoll.js';
// imports scoring logic
import { calculate3k, calculate4k, calculateYah, calcObjTotal, calcBonusTop, sumFromCounter, calculateFH, calculateSS, calculateLS, calcTopTotal, calculateTop, calculateMaxCount } from './scriptScore.js';

let rollData = { arrayRoll: [], arrayChoice: [] };

let arrayCounter = [];

let topScores = { scoreTop1: 0, scoreTop2: 0, scoreTop3: 0, scoreTop4: 0, scoreTop5: 0, scoreTop6: 0 };
let totalScores = { scoreTopSub: 0, scoreTopBonus: 0, scoreTopTotal: 0, scoreBotTotal: 0, scoreGameTotal: 0}
let botScores = { score3k: 0, score4k: 0, scoreFH: 0, scoreSS: 0, scoreLS: 0, scoreYah: 0, scoreChan: 0 };

arrayCounter = [5,0,1,4,4,5];
// topScores.scoreTop3 = 3;
// console.log("Roll data after set roll: ", rollData.arrayRoll);
// rollFunc.getArrayCounter(rollData.arrayRoll, arrayCounter);

// rollData.arrayChoice = rollFullPure();
// console.log("Initial Roll is: ", rollData.arrayChoice)

// rollData.arrayChoice = reRollPure();
// console.log("New Roll is: ", rollData.arrayChoice)

// rollFunc.rollFull(rollData.arrayRoll);
// console.log("Roll data after 1st roll: ", rollData.arrayRoll);
// rollFunc.clearArray(rollData.arrayRoll);
// console.log("Roll data after clear: ", rollData.arrayRoll);
// rollData.arrayRoll[1] = 0;
// rollFunc.reRoll(rollData.arrayRoll);
// console.log("Roll dice after 2nd roll: ", rollData.arrayRoll);
// rollFunc.reRoll(rollData.arrayRoll);
// console.log("Roll dice after 3rd roll: ", rollData.arrayRoll);

// arrayCounter = getArrayCounterPure(rollData.arrayChoice);
console.log("ArrayCounter after roll is: ", arrayCounter);

botScores.scoreChan = sumFromCounter(arrayCounter);
topScores.scoreTop1 = calculateTop(arrayCounter, 0);
topScores.scoreTop2 = calculateTop(arrayCounter, 1);
topScores.scoreTop3 = calculateTop(arrayCounter, 2);
topScores.scoreTop4 = calculateTop(arrayCounter, 3);
topScores.scoreTop5 = calculateTop(arrayCounter, 4);
topScores.scoreTop6 = calculateTop(arrayCounter, 5);

totalScores.scoreTopSub = calcObjTotal(topScores);

totalScores.scoreTopBonus = calcBonusTop(totalScores.scoreTopSub);

totalScores.scoreTopTotal = totalScores.scoreTopSub + totalScores.scoreTopBonus

botScores.score3k = calculate3k(arrayCounter);
botScores.score4k = calculate4k(arrayCounter);

botScores.scoreFH = calculateFH(arrayCounter);
botScores.scoreSS = calculateSS(arrayCounter);
botScores.scoreLS = calculateLS(arrayCounter);

botScores.scoreYah = calculateYah(arrayCounter);

console.log("value of 1's: ", topScores.scoreTop1);
console.log("Value of 2's ", topScores.scoreTop2);
console.log("Value of 3's: ", topScores.scoreTop3);
console.log("Value of 4's: ", topScores.scoreTop4);
console.log("Value of 5's: ", topScores.scoreTop5);
console.log("Value of 6's: ", topScores.scoreTop6);
console.log("Value of sub Top: ", totalScores.scoreTopSub);
console.log("Value of Bonus: ", totalScores.scoreTopBonus);
console.log("Value of Top: ", totalScores.scoreTopTotal);
console.log("Value of 3k: ", botScores.score3k);
console.log("Value of 4k: ", botScores.score4k);
console.log("Value of FH: ", botScores.scoreFH);
console.log("Value of SS: ", botScores.scoreSS);
console.log("Value of LS: ", botScores.scoreLS);
console.log("Value of Yahtzee: ", botScores.scoreYah);
console.log("Value of Chance: ", botScores.scoreChan);
console.log("Value of Top: ", totalScores.scoreTopTotal);
// console.log("Value of Bot: ", scoreData.scoreBotTotal);
// console.log("Value of Total: ", scoreData.scoreTotal);