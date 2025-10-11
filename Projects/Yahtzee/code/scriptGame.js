/*-------------------------------Current Issues to fix-----------------------------------*/

/*
* Currently, the main issue is with score logic in scriptScore.

* For comparison, roll logic works by having the roll logic functions imported into the main logic.
* The functiosn for roll are not written using game objects, however. They are just local varibles, 
and then the game objects (like counter arrays and roll arrays), are passed into them when used

* I tried using that system for score logic, but I don't know how.
* There are 18 different values that can be calculated in Yazhtzee, and I am still unclear about how the modularization setup should work.
I can do it like I did above, where I write functions with local variables and then pass the game objects
into them when I run them in main logic, but there are 18 values to calculate.
Am I supposed to inmport every function to calculate any of the 18 values?
I tried nesting my functions (so total score consists of bottom and top, top consists of the value for each face value, etc...),
And then just importing the one function, but that didn't seem to work.

No matter what I try, the issue seems to be the same. Whenever I try to reference a game object in one of the other, non-main
modules, it says that the object is undefined and can't be read.

The functions work if I call them from the module itself (so if I give the counter array to scriptScore, and use the functions
within the module, they work), but as I understand it, that is not how node.js is supposed to work. I should create independent 
functions in the modules, export those functions to the main module that controls the game logic, and run them from there.

And I'm not clear on how to do that.
*/




// code for the game logic of Yazhtzee

/* Thid module holds all of the values and arrays needed for the game of Yahztzee, as well as the counter function that 
dictates the actions of the game based on the state of the game (number of rolls, number of scores)
*/

/*-------------------------------imports-----------------------------------*/

// imports rolling logic
import { rollFullPure, reRollPure, getDiceNumber } from './scriptRoll.js';
// imports scoring logic
import { calculate3k, calculate4k, calculateYah, calcObjTotal, calcBonusTop, sumFromCounter, calculateFH, calculateSS, calculateLS, calcTopTotal, calculateTop, calculateMaxCount } from './scriptScore.js';
// imports utility functions
import { getArrayCounterPure, DICE_SIDES } from './scriptHandle.js';

/*-------------------------------on load stuff-----------------------------------*/


let newRollButton;
let reRollButton;
let scoreButton;

// on load functions
window.onload = function () {
    loadScoreBoard('./scoreAreaYatzy.html')
}

// loads the scoreboard
function loadScoreBoard(page) {
    fetch(page)
        .then(Response => Response.text())
        .then(html => {
            const scoreBoard = document.getElementById('scoreTable');
            scoreBoard.innerHTML = html;
            scoreBoard.classList.add('show');

            newRollButton = document.getElementById('newRoll');
            reRollButton = document.getElementById('reRoll');
            scoreButton = document.getElementById('score');

            newRollButton.addEventListener('click', onNewRollClick, () => console.log('getDice clicked'));
            reRollButton.addEventListener('click', onReRollClick, () => console.log('reRoll clicked'));
            scoreButton.addEventListener('click', onScoreClick, () => console.log('scoreClear clicked'));
            updateButtons();

            for (let i = 0; i < DICE_COUNT; i++) {
                const rollImg = document.getElementById(`dice${i+1}`);
                const choiceImg = document.getElementById(`choice${i+1}`);

                if (rollImg) {
                    rollImg.addEventListener('click', () => toggleHold(i));
                }
                if (choiceImg) {
                    choiceImg.addEventListener('click', () => toggleHold(i));
                }
            }
        })
}


/*-------------------------------variables-----------------------------------*/

const selectImage = document.getElementById;

const DICE_COUNT = 5;
// const DICE_SIDES = 6;
// the roll of the dice
let rollArray = Array(DICE_COUNT).fill(0);
// which dice are kept and selected
let held = Array(DICE_COUNT).fill(false);
// which dice the player has selected
let choiceArray = [];
// the array counter that states how many times of each value has been rolled
let arrayCounter = Array(DICE_SIDES).fill(0);
// counter is used to keep track of how many rolls the player has taken. Different actions are taken based on its value.
let rollCount = 0;
// max roll count
const MAX_ROLLS = 3;


const dieImg = v => `images/side${v}.png`;

/* Holds the roll values for each turn.
arrayRoll is the face value of each roll.s
If a player wants to keep a dice, then the value is duplicated in arrayChoice, and the value in arrayRoll is changed to 0
0 values do not get re-Rolled 
After 3 rolls, any non-0 dice are "moved" to arrayChoice and changed to zero
arrayChoice is used to calcualte the possible scores for each turn */


/* This array counts how many times a value appears.
This is what is used for scoring logic. 
The reason for doing this is because most of the scores in a yahztee game are independent of the 
dice values or their positions. A 3 of a kind can occur with 6 different values in many combinations(1-1-1, 2-2-2, etc.). 
With a counter array, you can check for a 3 of a kind more efficiently by just checking if the counter array has a 3 in it, 
regardless of what combination it comes in. 
Similar logic applies to straights, yahtzee, and full house. 
*/


let topScores = { scoreTop1: 0, scoreTop2: 0, scoreTop3: 0, scoreTop4: 0, scoreTop5: 0, scoreTop6: 0 };
let totalScores = { scoreTopSub: 0, scoreTopBonus: 0, scoreTopTotal: 0, scoreBotTotal: 0, scoreGameTotal: 0}
let botScores = { score3k: 0, score4k: 0, scoreFH: 0, scoreSS: 0, scoreLS: 0, scoreYah: 0, scoreChan: 0 };

// scoreBotTotal: 0, scoreTotal: 0

/*-------------------------------functions-----------------------------------*/

// controls the available actions for each turn
function updateButtons() {
    console.log("[updateButtons] rollCount", rollCount, "MAX: ", MAX_ROLLS);
    if (rollCount === 0) {
        console.log("branch: rollCount === 0: ", rollCount);
        newRollButton.disabled = false;
        reRollButton.disabled = true;
        scoreButton.disabled = true;
    } else if (rollCount < MAX_ROLLS) {
        console.log("branch: 1..2: ", rollCount);
        newRollButton.disabled = false;
        reRollButton.disabled = false;
        scoreButton.disabled = true;
    } else {
        console.log("branch: === 3: ", rollCount);
        newRollButton.disabled = false;
        reRollButton.disabled = true;
        scoreButton.disabled = false;
        holdAllDice();
        applyChoice();
        renderAllImages();
        // console.log("Road bump");
        calculateScores();
        console.log("Final Choice is: ", choiceArray);
        console.log("Final held state is: ", held);
        // clearRollArray();
    }
}

function startNewTurn() {
    rollCount = 0;
    updateButtons();
}

function onNewRollClick() {
    // guard
    // if (rollCount != 0) return;

    newRoll();
    rollCount = 1;
    updateButtons();
}

function onReRollClick() {
    if (rollCount >= MAX_ROLLS) return;

    reRoll();
    rollCount += 1;
    updateButtons();
}

function onScoreClick() {
    if (rollCount === 0) return;

    startNewTurn();
}
// render all images

function renderAllImages () {
    renderRollImages();
    renderChoiceImages();
}

// rendering images
function renderRollImages() {
    for (let i = 0; i < DICE_COUNT; i++) {
        const img = document.getElementById(`dice${i+1}`);
        if (!img) continue;
        img.src = held[i] ? dieImg(0) : dieImg(rollArray[i]);
        img.style.cursor = `pointer`;
    }
}

function renderChoiceImages() {
    for (let i = 0; i < DICE_COUNT; i++) {
        const img = document.getElementById(`choice${i+1}`);
        if (!img) continue;
        img.src = held[i] ? dieImg(rollArray[i]) : dieImg(0);
        img.style.cursor = 'pointer';
    }
}

// applying a roll
function applyRoll(diceArray) {
    rollArray = diceArray;
    console.log("New Roll has been applied. It is :", rollArray);
    arrayCounter = getArrayCounterPure(diceArray);
    console.log("New array counter is: ", arrayCounter);
    console.log("Selection state is: ", held);
    renderAllImages();
}

// create a choice array. wrote this one by myself
function applyChoice() {
    const choice = rollArray.map((v,i) => held[i] ? v : 0);
    choiceArray = choice; 
    console.log("Choice array is:", choiceArray);
}

// toggle
function toggleHold(index) {
    held[index] = !held[index];
    renderAllImages();
    console.log("You have selected a dice. Dice: ");
}

// start a new roll
function newRoll() {
    held = Array(DICE_COUNT).fill(false);
    const dice = rollFullPure(DICE_COUNT);
    applyRoll(dice);
    applyChoice();
}

function reRoll() {
    const next = rollArray.map((v,i) => held[i] ? v : Math.floor(Math.random() * 6) + 1);
    applyRoll(next);
    applyChoice();
}

function resetTurnState() {
    held = Array(DICE_COUNT).fill(false);
    choiceArray = Array(DICE_COUNT).fill(0);
    counter = 0;
}

function endRoll() {
    resetTurnState();
    console.log("turn state has been reset");
    const dice = rollFullPure(DICE_COUNT);
    applyRoll(dice);
    renderAllImages();
}

function holdAllDice() {
    for (let i = 0; i < DICE_COUNT; i++) {
        held[i] = true;
    }
}

function calculateScores() {
    const array = arrayCounter;

    for (let i = 0; i <= DICE_COUNT; i++) {
        const score = calculateTop(array, i);
        topScores[`scoreTop${i+1}`] = score;
    }

    console.log("Top scores are: ", topScores);

}


// // calls scoring logic to get current score and then clears board and rerolls. Connected to Score button
// function scoreClear() {

//     sumFromCounter(arrayCounter); // top total without bonus
//     calculateTotalTop(); // top total with bonus
//     calculateBotTotal(); // bot total
//     calculateTotal(); // gets total
//     styleInputValues();
//     updateCurrentTotal(); // updates total displayed at top of scoreboard
//     clearChoiceDice();
//     clearPlaceHolder(); // clears placeholders from the roll
//     counter = 0; // resets counter to 0
//     getDice(); // does a fresh new roll

//     console.log('Counter is: ', counter);
// }

/* this functions determines values for 3 of a kind, 4 of kind and Yahtzee. This is done here instead of score logic
because a given roll can allow for multiply values (a Yahtzee, or 5 of a kind, is also a 4 of a kind */

// old functions

// function getNewDice() {

//     clearChoiceDice();

//     for (let i = 1; i <= 5; i++) {
//         const diceContainer = document.getElementById(`dice${i}`); // get the container that holds the image
//         console.log(`Dice container for roll ${i}`, diceContainer);

//         diceContainer.style.display = "flex"; // make visible by making the images flex

//         const diceNumber = getDiceNumber(); // get a random number
//         console.log(`Dice ${i} rolled: ${diceNumber}`);

//         const imgPath = `side${diceNumber}.png`;
//         console.log(`Generated image path: ${imgPath}`);

//         diceContainer.src = imgPath;
//     }

//     counter++;
//     controlButtons();
//     //console.log(counter);
//     //console.log(document.getElementById('newRoll').disabled);
// }


// // clears any dice in the score area and replaces with empty dice image. Also resets fullFull and count Totals
// function clearChoice() {

//     for (let i = 1; i <= DICE_COUNT; i++) {
//         const img = document.getElementById(`choice${i}`);

//         if (img) img.src = "side0.png"
//     }
// }

// function resetChoiceState() {
//     arrayChoice = [];
//     arrayCounter = [0, 0, 0, 0, 0, 0]
// }

// function clearChoiceDice() {
//     clearChoice();
//     resetChoiceState();
// }

// // roles the dice again after the initial roll. Connected to Roll Again button
// function reRoll() {

//     // rolls new dice for all 5 dice in the roll area
//     for (let i = 1; i <= 5; i++) {
//         let diceContainer = document.getElementById(`dice${i}`); // get the container that holds the image
//         console.log(`Dice container for roll ${i}`, diceContainer);

//         if (!(diceContainer.src.endsWith("side0.png"))) {
//             const diceNumber = getDiceNumber(); // get a random number
//             console.log(`Dice ${i} rolled: ${diceNumber}`);

//             const imgPath = `side${diceNumber}.png`;
//             console.log(`Generated image path: ${imgPath}`);

//             diceContainer.src = imgPath;
//         }
//     }

//     counter++;
//     controlButtons();
//     //console.log(counter);
//     //console.log(document.getElementById('newRoll').disabled);
// }