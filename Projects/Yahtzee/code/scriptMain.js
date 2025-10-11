
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
        })
}

//------------------------------------Yatzhee Game and Constants------------------------------------------//

// updates the display for the total score of the current game 
function updateCurrentTotal() {
    // Assuming `tot-up-game1` is the ID of the input holding the total score value
    let totalScoreInput = document.getElementById('tot-game1')
    let currentTotalDisplay = document.getElementById('current-total-display');

    // Set the span text to the input's value
    currentTotalDisplay.textContent = totalScoreInput.value || 0;
}

// constants

const selectImage = document.getElementById;

// listeners for buttons
const newRollButton = document.getElementById('newRoll');

const reRollButton = document.getElementById('reRoll');

const scoreButton = document.getElementById('score');

newRollButton.addEventListener('click', getDice);

reRollButton.addEventListener('click', reRoll);

scoreButton.addEventListener('click', scoreClear)

// counter is used to determine number of times player has rolled. 
let counter = 0;
// holds the face value of each roll
let fullRoll = [];
// counts the total times each face is rolled
let countTotal = [0, 0, 0, 0, 0, 0];

let scoreTotalTop = 0;
let scoreTotalBot = 0;


//-----------------------------------------------Rolling Logic & Game Counter----------------------------------------------//

/* primary function to control changes depending on the number of rolls player has
** gets array used to calculate scores based on face value of rolled dice
*/
function controlButtons() {

    if (counter === 0) {
        document.getElementById('reRoll').disabled = true;
        document.getElementById('score').disabled = true;
    } else if (counter === 1) {
        document.getElementById('newRoll').disabled = true;
        document.getElementById('reRoll').disabled = false;
        document.getElementById('score').disabled = true;
    } else if (counter === 2) {
        document.getElementById('score').disabled = true;
    } else if (counter === 3) {
        document.getElementById('newRoll').disabled = true;
        document.getElementById('reRoll').disabled = true;
        document.getElementById('score').disabled = false;
        clearRollDice(); // clears roll dice spot
        getFullRoll(); // gets the full roll
        arrayScoreCounterTop(); // calculates possible top scores
        arrayScoreCounterBot(); // calculates possible bot scores
    } else {
        console.log("Counter has been reset");
    }
}

// gets random number used to get dice
function getDiceNumber() {
    return Math.floor(Math.random() * 6) + 1;
} // Math.random gives a number that is greater >= 0 and < 1. Multiply by 6 and add 1 gives you 1-6 because it can't be 1


// conneted to NewRoll button. Does a fresh new roll
function getDice() {

    clearChoiceDice();

    for (let i = 1; i <= 5; i++) {
        const diceContainer = document.getElementById(`dice${i}`); // get the container that holds the image
        console.log(`Dice container for roll ${i}`, diceContainer);

        diceContainer.style.display = "flex"; // make visible by making the images flex

        const diceNumber = getDiceNumber(); // get a random number
        console.log(`Dice ${i} rolled: ${diceNumber}`);

        const imgPath = `images/side${diceNumber}.png`;
        console.log(`Generated image path: ${imgPath}`);

        diceContainer.src = imgPath;
    }

    counter++;
    controlButtons();
    //console.log(counter);
    //console.log(document.getElementById('newRoll').disabled);
}

// roles the dice again after the initial roll. Connected to Roll Again button
function reRoll() {

    // rolls new dice for all 5 dice in the roll area
    for (let i = 1; i <= 5; i++) {
        let diceContainer = document.getElementById(`dice${i}`); // get the container that holds the image
        console.log(`Dice container for roll ${i}`, diceContainer);

        if (!(diceContainer.src.endsWith("images/side0.png"))) {
            const diceNumber = getDiceNumber(); // get a random number
            console.log(`Dice ${i} rolled: ${diceNumber}`);

            const imgPath = `images/side${diceNumber}.png`;
            console.log(`Generated image path: ${imgPath}`);

            diceContainer.src = imgPath;
        }
    }

    counter++;
    controlButtons();
    //console.log(counter);
    //console.log(document.getElementById('newRoll').disabled);
}

// calls scoring logic to get current score and then clears board and rerolls. Connected to Score button
function scoreClear() {

    calculateSubTotTop(); // top total without bonus
    calculateTotalTop(); // top total with bonus
    calculateBotTotal(); // bot total
    calculateTotal(); // gets total
    styleInputValues();
    updateCurrentTotal(); // updates total displayed at top of scoreboard
    clearChoiceDice();
    clearPlaceHolder(); // clears placeholders from the roll
    counter = 0; // resets counter to 0
    getDice(); // does a fresh new roll

    console.log('Counter is: ', counter);
}

// retrieves dice image and gets corresponding dice value at the end of a turn. Places the values in an array
function getFullRoll() {

    let value;

    for (let i = 1; i <= 5; i++) {
        const diceContainer = document.getElementById(`choice${i}`); // get the container that contains the dice

        const imgPath = diceContainer.src.split('/').pop(); // extract image name from source path

        value = getCountVale(imgPath);

        // console.log(value);

        if (!(value === 0 || diceContainer.style.display === "none")) {
            fullRoll.push(value)
        }
    }

    console.log('Full Roll is: ', fullRoll);
    return fullRoll;
}

// updates the countTotal array to see how many times each face is rolled
function getCountTotalArray() {

    for (let i = 0; i < fullRoll.length; i++) {
        if (fullRoll[i] === 1) {
            countTotal[0] += 1;
        } else if (fullRoll[i] === 2) {
            countTotal[1] += 1;
        } else if (fullRoll[i] === 3) {
            countTotal[2] += 1;
        } else if (fullRoll[i] === 4) {
            countTotal[3] += 1;
        } else if (fullRoll[i] === 5) {
            countTotal[4] += 1;
        } else if (fullRoll[i] === 6) {
            countTotal[5] += 1;
        }
    }
}

// calculates which face value is the most common. Used for kinds and yazhtee
function calculateMaxCount() {
    maxCount = Math.max(...countTotal);
}

// allows player to select a dice and move it to the scoring area
function selectDiceClick(diceNumber) {

    const clickedDice = document.getElementById(`dice${diceNumber}`);
    const choiceDice = document.getElementById(`choice${diceNumber}`);

    if (!(clickedDice.src === "images/side0.png")) {

        const imgPath = clickedDice.src // I think this is mostly right. The part of i'm not sure about is I want to get the same image path of the clickedDice

        choiceDice.src = imgPath;

        clickedDice.src = "images/side0.png"
    }
}

// allows player to unselect a choosen dice and return it to be rerolled
function unSelectDiceClick(diceNumber) {

    const clickedDice = document.getElementById(`choice${diceNumber}`);
    const choiceDice = document.getElementById(`dice${diceNumber}`);

    if (!(clickedDice.src === "images/side0.png")) {

        const imgPath = clickedDice.src // I think this is mostly right. The part of i'm not sure about is I want to get the same image path of the clickedDice

        choiceDice.src = imgPath;

        clickedDice.src = "images/side0.png"
    }
}

//------------------------------------------------Scoring Logic-------------------------------------------------------//


// retrives the sum of the final roll based on face value
function valueFullRoll() {

    let botSum = fullRoll.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

    return botSum;
}

// calculates the scores for the top
function arrayScoreCounterTop() {

    getCountTotalArray();

    for (let i = 0; i < countTotal.length; i++) {

        if (countTotal[i] > 0) {
            let topScoreField = document.getElementById(`g1-${i + 1}`);
            let scoreValue = countTotal[i] * (i + 1);
            topScoreField.placeholder = scoreValue;
        }
    }
}

function totalValue() {

}
/*
1. Calls functions for straights, full house, and chance
2. calculates the scores for kinds, yahtee
*/
function arrayScoreCounterBot() {

    let botScoreFieldYah;
    let botScoreFieldSum;

    calculateMaxCount();
    isSmallStraight();
    isLargeStraight();
    isFullHouse();
    isChance();

    // checks for yahztee, kinds
    if (maxCount === 5) {
        botScoreFieldYah = document.getElementById(`g1-yah`);
        botScoreFieldYah.placeholder += 50;
        botScoreFieldSum = document.querySelectorAll('#g1-3k, #g1-4k');
        botScoreFieldSum.forEach(field => {
            field.placeholder = valueFullRoll();
        })
    } else if (maxCount === 4) {
        botScoreFieldSum = document.querySelectorAll('#g1-3k, #g1-4k');
        botScoreFieldSum.forEach(field => {
            field.placeholder = valueFullRoll();
        })
    } else if (maxCount === 3) {
        botScoreFieldSum = document.querySelectorAll('#g1-3k');
        botScoreFieldSum.forEach(field => {
            field.placeholder = valueFullRoll();
        })
    }

    console.log("Count Total: ", countTotal);
    console.log("Highest Count: ", maxCount);
}

// checks for full house
function isFullHouse() {

    let has3k = false;
    let has2k = false;

    for (let i = 0; i < countTotal.length; i++) {
        if (countTotal[i] === 3) {
            has3k = true;
        } else if (countTotal[i] === 2) {
            has2k = true;
        }
    }

    if (has3k && has2k) {
        botScoreFieldFH = document.getElementById('g1-fh')
        botScoreFieldFH.placeholder = 25;
    }
}

// checks for small small straight
function isSmallStraight() {

    let botScoreFieldSS = document.getElementById('g1-ss')

    if (countTotal[0] >= 1 && countTotal[1] >= 1 && countTotal[2] >= 1 && countTotal[3] >= 1) {
        botScoreFieldSS.placeholder = 30;
    } else if (countTotal[1] >= 1 && countTotal[2] >= 1 && countTotal[3] >= 1 && countTotal[4] >= 1) {
        botScoreFieldSS.placeholder = 30;
    } else if (countTotal[2] >= 1 && countTotal[3] >= 1 && countTotal[4] >= 1 && countTotal[5] >= 1) {
        botScoreFieldSS.placeholder = 30;
    }
}

// checks for large straight
function isLargeStraight() {

    calculateMaxCount();
    let botScoreFieldLS = document.getElementById('g1-ls')

    if (maxCount === 1 && (countTotal[0] === 0 || countTotal[5] === 0)) {
        console.log("You got a large straight");
        botScoreFieldLS.placeholder = 40;
    } else {
        console.log("No larges straight"); 1
    }
}

// calculates chance
function isChance() {
    let scoreChanceContainer = document.getElementById("g1-chance");
    let scoreChance = valueFullRoll();

    if (scoreChanceContainer.value === "") {
        scoreChanceContainer.placeholder = scoreChance;
        console.log("Chance is ", scoreChance)
    }
}


//--------Subtotals and totals logic scoring logic


// calculates sub total for top
function calculateSubTotTop() {

    let topFields = document.querySelectorAll('#g1-1, #g1-2, #g1-3, #g1-4, #g1-5, #g1-6');
    let topSubTotal = 0;
    let topSubTotalContainer = document.getElementById('subTot-up-g1');

    topFields.forEach(field => {
        topSubTotal += Number(field.value) || 0;
    })

    topSubTotalContainer.value = topSubTotal;
}

// calculates top and adds bonus if threshold is met
function calculateTotalTop() {

    let subTotTopContainer = document.getElementById('subTot-up-g1');
    let subTotTopValue = Number(subTotTopContainer.value) || 0;
    let totTopContainer = document.getElementById('tot-up-g1-1');

    //totTopValue = number(totTopContainer.value) || 0;
    let subTopBonusContainer = document.getElementById('bonus-up-g1');
    // subTopBonusValue = subTopBonusContainer.value;

    // calculate the bonus
    let subTopBonusValue = subTotTopValue >= 63 ? 35 : 0;

    // calculate teh total top score
    let totTopValue = subTotTopValue + subTopBonusValue;

    // Update the DOM with the calculated values
    subTopBonusContainer.value = subTopBonusValue;
    totTopContainer.value = totTopValue;
}

// calculates bottom total
function calculateBotTotal() {

    let topFields = document.querySelectorAll('#g1-3k, #g1-4k, #g1-fh, #g1-ss, #g1-ss, #g1-yah, #g1-chance');
    let botSubTotal = 0;
    let topSubTotalContainer = document.getElementById('tot-low-g1');

    topFields.forEach(field => {
        botSubTotal += Number(field.value) || 0;
    })

    topSubTotalContainer.value = botSubTotal;
}

// calculates total
function calculateTotal() {

    // get containers
    let totalScoreContainer = document.getElementById('tot-game1');
    let totalScoreTopCont1 = document.getElementById('tot-up-g1-1');
    let totalScoreTopCont2 = document.getElementById('tot-up-g1-2')
    let totalScoreBotCont = document.getElementById('tot-low-g1');

    // extract values
    let totalScoreTop1 = Number(totalScoreTopCont1.value);
    let totalScoreBot = Number(totalScoreBotCont.value) || 0;

    // copies the top score to the bottom cell
    totalScoreTopCont2.value = totalScoreTop1;
    totalScoreTop2 = Number(totalScoreTopCont2.value);

    // gets the total score
    totalScore = totalScoreTop2 + totalScoreBot;
    totalScoreContainer.value = totalScore;
}


//-----------------------------------------Helper functions-------------------------------------------------//

// used to get the correct image based on the value created by the random number generator
function getCountVale(diceRoll) {

    console.log(`Generating image for dice number: ${diceRoll}`);

    switch (diceRoll) {
        case 'side0.png':
            return 0
            break;
        case 'side1.png':
            return 1
            break;
        case 'side2.png':
            return 2;
            break;
        case 'side3.png':
            return 3;
            break;
        case 'side4.png':
            return 4;
            break;
        case 'side5.png':
            return 5;
            break;
        case 'side6.png':
            return 6;
            break;
        default:
            console.log('Invalid dice roll');
            return '';
    }
}

// clears any dice in the score area and replaces with empty dice image. Also resets fullFull and count Totals
function clearChoiceDice() {

    for (let i = 1; i <= 5; i++) {
        const diceContainer = document.getElementById(`choice${i}`);

        diceContainer.src = "side0.png"
    }

    fullRoll = [];
    countTotal = [0, 0, 0, 0, 0, 0]
}

// clears dice in the roll area and moves them to the scoring area. Replaces with empty image
function clearRollDice() {

    for (let i = 1; i <= 5; i++) {
        const rolledDice = document.getElementById(`dice${i}`);
        const choiceDice = document.getElementById(`choice${i}`);

        if (!(rolledDice.src.endsWith("side0.png"))) {
            const imgPath = rolledDice.src
            choiceDice.src = imgPath;
            rolledDice.src = "side0.png"
        }
    }
}

// clears placeholder in the scoring area after each turn
function clearPlaceHolder() {

    const placeHolderInput = document.querySelectorAll('input[name="g1"]');

    placeHolderInput.forEach(field => {

        if (!field.value) {
            field.placeholder = "";
        }
    })
}

// makes iput values bold to help differentiate them from placeholders

function styleInputValues() {

    const inputFields = document.querySelectorAll('input[type="currentGame"]');

    // loop through each field to add event listeners
    inputFields.forEach(field => {
        //check to see if the field has value
        if (field.value) {
            field.classList.add('inputValues');
        } else {
            field.classList.remove('input');
        }
    });
}
