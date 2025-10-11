const DICE_SIDES = 6;

function getArrayCounterPure(dice, sides = DICE_SIDES) {
    const counter = Array(sides).fill(0);
    for (const v of dice) {
        if (v >= 1 && v <= sides) counter [v - 1] += 1;
    }
    return counter;
}

export { getArrayCounterPure, DICE_SIDES };

