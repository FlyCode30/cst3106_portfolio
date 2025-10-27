
/*-------------------------------imports-----------------------------------*/

// imports rolling logic
import { rollFullPure, reRollPure, getDiceNumber } from './scriptRoll.js';
// imports scoring logic
import { calculate3k, calculate4k, calculateYah, calcObjTotal, calcBonusTop, sumFromCounter, calculateFH, calculateSS, calculateLS, calcTopTotal, calculateTop, calculateMaxCount } from './scriptScore.js';
// imports utility functions
import { getArrayCounterPure, DICE_SIDES } from './scriptHandle.js';

/*-------------------------------on load functions-----------------------------------*/

// on load functions
window.onload = function () {
    loadScoreBoard('scoreAreaYatzy.html')
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

            newRollButton.addEventListener('click', resetGameState, () => console.log('getDice clicked'));
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

        setLoadDice([1,2,3,4,5]);
        
}

function setLoadDice(values) {
    rollArray = values.slice(0, DICE_COUNT);
    renderAllImages();
}

/*-------------------------------variables-----------------------------------*/

let newRollButton;
let reRollButton;
let scoreButton;

const selectImage = document.getElementById;

const DICE_COUNT = 5;
// const DICE_SIDES = 6;
// the roll of the dice
let rollArray = Array(DICE_COUNT).fill(0);
// which dice are kept and selected
let held = Array(DICE_COUNT).fill(false);
// which dice the player has selected
// let choiceArray = [];
// the array counter that states how many times of each value has been rolled
let arrayCounter = Array(DICE_SIDES).fill(0);
// counter is used to keep track of how many rolls the player has taken. Different actions are taken based on its value.
let rollCount = 0;
// max roll count
const MAX_ROLLS = 3;
// 


const dieImg = v => v === 0 ? `assets/images/side0.png` : `assets/images/side${v}.png`;


let tempTopScores = { scoreTop1: 0, scoreTop2: 0, scoreTop3: 0, scoreTop4: 0, scoreTop5: 0, scoreTop6: 0 };
const comTopScores = { scoreTop1: 0, scoreTop2: 0, scoreTop3: 0, scoreTop4: 0, scoreTop5: 0, scoreTop6: 0 };
let totalScores = { scoreTopSub: 0, scoreTopBonus: 0, scoreTopTotal: 0, scoreBotTotal: 0, scoreGameTotal: 0}
let tempBotScores = { scoreBot3k: 0, scoreBot4k: 0, scoreBotFH: 0, scoreBotSS: 0, scoreBotLS: 0, scoreBotYah: 0, scoreBotChan: 0 };
const comBotScores = { scoreBot3k: 0, scoreBot4k: 0, scoreBotFH: 0, scoreBotSS: 0, scoreBotLS: 0, scoreBotYah: 0, scoreBotChan: 0 };

/*------------------------------- Update functions-----------------------------------*/

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
        // applyChoice();
        renderAllImages();
        // console.log("Final Choice is: ", choiceArray);
        console.log("Final held state is: ", held);
        // console.log("Road bump");
        calculateScores();
        
        fillPlaceholders();
        console.log("Temp Top Scores are: ", tempTopScores);
        console.log("Temp Bot Scores are: ", tempBotScores);
        // clearRollArray();
    }
}

function startNewTurn() {
    rollCount = 0;
    held = Array(DICE_COUNT).fill(false);
    const dice = rollFullPure(DICE_COUNT);
    applyRoll(dice);
    rollCount += 1;
    updateButtons();
}

function resetGameState() {
    clearComScores();
    resetInputStyles();
    displayTotalsUI();

    startNewTurn();

    console.log("Temp Top Scores are: ", tempTopScores);
    console.log("Temp Bot Scores are: ", tempBotScores);
    console.log("Com Top Scores are: ", comTopScores);
    console.log("Com Bot Scores are: ", comBotScores);
    console.log("Total scores are: ", totalScores);
}

/*------------------------------- button click functions-----------------------------------*/

function onReRollClick() {
    if (rollCount >= MAX_ROLLS) return;

    reRoll();
    rollCount += 1;
    updateButtons();
}

function onScoreClick() {

    if (rollCount === 0) return;
    const category = getFilledCategoryFromDOM();
    if (!category) {
        console.warn("Nothing to committ: Fill exactly 1 box first.");
        return;
    }

    // commit choosen category
    commitScore(category);
    calculatTotals();
    fillTotals();
    
    console.log("Committed Top Scores are: ", comTopScores);
    console.log("Commmitted Bot Scores are: ", comBotScores);

    clearPlaceholders();
    styleInputValues();
    displayTotalsUI();
 
    startNewTurn();

    console.log("Total Scores are: ", totalScores)
}

/*-------------------------------roll functions-----------------------------------*/

// takes a rolled array and creates the counter array used for scoring

function applyRoll(diceArray) {
    rollArray = diceArray;
    console.log("New Roll has been applied. It is :", rollArray);
    arrayCounter = getArrayCounterPure(diceArray);
    console.log("New array counter is: ", arrayCounter);
    console.log("Selection state is: ", held);
    renderAllImages();
}

// rerolls during an existing turn

function reRoll() {
    const next = rollArray.map((v,i) => held[i] ? v : Math.floor(Math.random() * 6) + 1);
    applyRoll(next);
    // applyChoice();
}

// looks at the rolled array and creates a choice array based on whether or not a player has selected that spot. 

// function applyChoice() {
//     const choice = rollArray.map((v,i) => held[i] ? v : 0);
//     choiceArray = choice; 
//     console.log("Choice array is:", choiceArray);
// }

/*-------------------------------hold functions-----------------------------------*/

// toggle
function toggleHold(index) {
    held[index] = !held[index];
    renderAllImages();
    console.log("You have selected a dice. Dice: ");
}

// used at the end of a turn to take all unselected dice and change them to held so they become part of the choice array

function holdAllDice() {
    for (let i = 0; i < DICE_COUNT; i++) {
        held[i] = true;
    }

    for (let i = 0; i < DICE_COUNT; i++) {
        const img = document.getElementById(`dice${i+1}`);
        if (!img) continue;
        img.src = held[i] ? dieImg(0) : dieImg(rollArray[i]);
        img.style.cursor = `pointer`;
    }
}

/*-------------------------------Score functions-----------------------------------*/


function commitScore(category) {

    const field = document.querySelector(`.score-input[data-category="${category}"]`);
    if (!field) return;

    const raw = field.value.trim();
    const value = raw === "" ? 0 : Number(raw);  // allows crossing out with 0

    if (category.startsWith('scoreTop')) {
        if (comTopScores[category] === 0) comTopScores[category] = value;  
    } else {
        if (comBotScores[category] === 0) comBotScores[category] = value;    
    }
    
    field.value = String(value);
}


function calculateScores() {
    const array = arrayCounter;

    for (let i = 0; i <= DICE_COUNT; i++) {
        const score = calculateTop(array, i);
        tempTopScores[`scoreTop${i+1}`] = score;
    }
    // totalScores.scoreTopSub = sumFromCounter(array);
    // totalScores.scoreTopBonus = calcBonusTop(totalScores.scoreTopSub);
    // totalScores.scoreTopTotal = calcTopTotal(totalScores.scoreTopSub, totalScores.scoreTopBonus);
    tempBotScores.scoreBot3k = calculate3k(array);
    tempBotScores.scoreBot4k = calculate4k(array);
    tempBotScores.scoreBotFH = calculateFH(array);
    tempBotScores.scoreBotSS = calculateSS(array);
    tempBotScores.scoreBotLS = calculateLS(array);
    tempBotScores.scoreBotChan = sumFromCounter(array);
    tempBotScores.scoreBotYah = calculateYah(array);
}


function calculatTotals() {

    totalScores.scoreTopSub = calcObjTotal(comTopScores);
    totalScores.scoreTopBonus = calcBonusTop(totalScores.scoreTopSub);
    totalScores.scoreTopTotal = totalScores.scoreTopSub + totalScores.scoreTopBonus;

    totalScores.scoreBotTotal = calcObjTotal(comBotScores);
    totalScores.scoreGameTotal = totalScores.scoreTopTotal + totalScores.scoreBotTotal;  
}

// used to get the scores a player puts in the field so they can be converted to committed scores
function getFilledCategoryFromDOM() {
    const fields = document.querySelectorAll('.score-input');
    for (const field of fields) {
        const cat = field.dataset.category;
        if (!cat) continue;

        // skip categories already filled
        const isTop = cat.startsWith('scoreTop');
        const isCommitted = isTop ? comTopScores[cat] !== 0 : comBotScores[cat] !== 0;

        // treat non empty as the category
        if (!isCommitted && field.value.trim() !== "") return cat;
    }

    return null;
}

/*-------------------------------render functions-----------------------------------*/


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

/*-------------------------------DOM functions-----------------------------------*/


// fills placeholder values to indicate all possible score combinations to the player

function fillPlaceholders() {

    for (const [cat, val] of Object.entries(tempTopScores)) {
    const el = document.querySelector(`[data-category="${cat}"]`);
    // console.log("TOP map:", cat, "temp=", val, "input?", !!el, "committed=", comTopScores[cat]);
    if (!el || comTopScores[cat] !== 0) continue;
    el.value = "";
    el.placeholder = String(val ?? "");
  }

  // Bottom
    for (const [cat, val] of Object.entries(tempBotScores)) {
    const el = document.querySelector(`[data-category="${cat}"]`);
    // console.log("BOT map:", cat, "temp=", val, "input?", !!el, "committed=", comBotScores[cat]);
    if (!el || comBotScores[cat] !== 0) continue;
    el.value = "";
    el.placeholder = String(val ?? "");
  }
//   console.log("testing break point");
}

// used on new roll to clear any placeholder values 
function clearPlaceholders() {

    const fields = document.querySelectorAll('.score-input');

    for (const field of fields) {
        if (!field.value) {
            field.placeholder = "0";
        }
    }
}


// fills the DOM elements related to totals
function fillTotals () {

    for (const [cat, val] of Object.entries(totalScores)) {
        if (val == null) continue;

    const nodes = document.querySelectorAll(`.score-totals[data-category="${cat}"]`);
    // console.log("TOP map:", cat, "temp=", val, "input?", !!el, "committed=", comTopScores[cat]);
    nodes.forEach (el => {
        el.value = String(val);
    });
  }
}

/*-------------------------------formatting functions-----------------------------------*/


function styleInputValues() {

    const inputFields = document.querySelectorAll('.score-input, .score-totals');

    // loop through each field to add event listeners
    inputFields.forEach(field => {
        //check to see if the field has value
        if (field.value.trim() !== "") {
            field.classList.add('inputValues');
        } else {
            field.classList.remove('inputValues');
        }
    });
}

function clearComScores() {
  [comTopScores, comBotScores, totalScores].forEach(obj => {
    Object.keys(obj).forEach(k => obj[k] = 0);
  });
}

// reset formatting in DOM
function resetInputStyles() {
    const inputFields = document.querySelectorAll('.score-input, .score-totals');

    inputFields.forEach( field => {
        field.value = "";
        field.placeholder = "";
        field.classList.remove("inputValues");
    })
}

// display total score on the UI

function displayTotalsUI() {
  const totalDisplay = document.getElementById('current-total-display');
  if (!totalDisplay) return; // just in case it’s not found

  totalDisplay.textContent = totalScores.scoreGameTotal;
}





