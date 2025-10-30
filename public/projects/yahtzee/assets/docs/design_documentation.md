# Design System Documentation for Michael Kubisewsky's Yahtzee Game

## 1. Introduction

This app is a 1 player version of the game Yahtzee. It is a game in which players roll 5 dice in order to get certain combinations of numbers and accumulate the highest possible score based on those combinations. The following is a public readme that gives an overview of the rules of the game, the coding logic flow, and its main features. In order to run the game from the available files, run the file `playingAreayatzy.html` (scoring sheet will load with it).

### Important Features

- Built with HTML, CSS, and JavaScript.
- Modular structure.
- Interactive scoresheet with live roll tracking.
- Compaitable with mobile and desktop. 

## 2. Architectural Summary

The JavaScript code is divided into 4 main modules. They include

- scriptGame.js contains the game logic. It is the main module used to control the actual game state and DOM elements the player interacts with.
- scriptRoll.js is the roll logic and contains the functions needed to roll the dice.
- scriptScore.js is the score logic and contains the functions needed to score the rolls.
- scriptHandle.js is utility logic and contains functions helper functions that did not fall under any of the other categories. 

## 3. Overview of Yahtzee rules

### Roll Rules

A player can roll a total of 3 times, and after the 1st and 2nd roll, players may decide to keep their dice till the end of the turn or roll them again.

### General Scoring Rules

Scores are divided into top and bottom scores. A player can only put in 1 score per turn and cannot change the score once it has been put in.

Top Scores: Counts how many times a certain number appears. There are 6 spots, 1 for each dice value, and the score is the number of that die face showing at the end of a turn. So 3 4's would be 12 in the 4 spot.

Bottom Scores: Based on rolled combinations

- 3 of a kind: Player counts the total value of all dice showing if they have a 3 of a kind.
- 4 of a kind: Player counts the total value of all dice showing if they have a 4 of a kind.
- Full house: If a player has a 3 of a kind and a pair (ex. 4,4,4,5,5), they score 25.
- Small Straight: If a player has a straight consisting of 4 dice, they score 30.
- Large Straight: If a player has a straight consisting of 5 dice, they score 40.
- Yahtzee: If a player has a 5 of a kind, they score 50.
- Chance: Used once per game when the player can't score anything else. No combination is required for chance. Scores the total value of the dice showing. 

## 4. Overview of Code and flow logic

### Primary Variables used

- `rollArray`: An array that contains the values the player has rolled. Resets at the end of a turn.
- `held`: An array which determines which dice the player wants to keep. If the second spot of held array is true (held[1]), then that dice is not rerolled in rollArray. 
- `rollCount`: roll count that determines how many times the player has rolled
- `tempTop/BotScores`: These are temporary scores. This represents the score a player has at any given time. These scores do not carry on past 1 turn. 
- `comTop/BotScores`: These are committed scores. These scores represent the scores a player maintains throughout the game and determines their total score.
- `arrayCounter`: This is an array that determines how many of each number a player has. So 1, 1, 3, 4, 6 would be 2, 0, 1, 1, 0, 1. This is used to calculate scores for the combinations. It is done this way because a full house, for example, is any combination of 3 of a kind and a pair (ex. 4,4,4,2,2 or 6,6,6,1,1 all give the same thing). Since there are so many combos, it is easier to use an array counter since any array counter that contains a 3 and a 2 will score a full house, regardless of the value on the actual dice. 


### Game flow

This will go over the flow of a standard turn for 1 player. Each turn consists of 3 rolls, after which a player must put in a score and then roll again.

1. An array of numbers are rolled.
2. These numbers are transferred to the main roll array.
3. Images are rendered based on this rolled array.
4. Array counter is calculated.
5. End of 1st roll. 
6. Choose: Players can now choose which dice they want by clicking on a dice. This action changes the status of the held array and will "move" the dice the player wants to keep to a different section. There is no actual change in the rolled array, it only chooses what the player sees.
7. Reroll: Player can now reroll the dice up to 2 times. Held dice are not rolled again.
8. roll counter has hit 3, end of player turn. 
9. All remaining dice are changed to held status and images are rendered.
10. Temporary scores (scores for this current round) are calculated.
11. Placeholders are shown on the score sheet so players can see their options based on temporary scores
12. A player puts in a score they want to keep.
13. The player clicks score.
14. The value put in by the player is converted to a committed score array. These persist over the course of a whole game and are used to calculate totals.
15. Total scores are calculated.
16. Totals are filled in on the score sheet.
17. Game status is reset. This means resetting the roll count to 0 and changing all held statuses to false.
18. A new roll is carried out and the turn repeats. 

### Summary of Functions in gameLogic

- Imports: imported functions from modules.
- Load functions: loads the HTML.
- Variables
- Update functions: Updates buttons and calls functions based on number of rolls.
- Button click functions. Determines what happens when player clicks roll buttons.
- Roll functions: Controls what happens on each type of roll.
- Hold functions. Determines what happens when a player clicks a dice to hold it. 
- Score functions. Controls scoring for both temporary and committed scores.
- Render functions. Controls the rendering of the DOM elements related to the dice.
- DOM functions. Controls how scoring sheet is filled based on what the player has rolled.
- Formatting functions. Controls formatting and UI appearance.



