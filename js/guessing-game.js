/* 

Write your guess-game code here! Don't forget to look at the test specs as a guide. You can run the specs
by running "testem".

In this file, you will also include the event listeners that are needed to interact with your HTML file when
a user clicks a button or adds a guess to the input field.

*/

function generateWinningNumber() {
    return Math.floor(Math.random() * 100) + 1;
}

function shuffle(arr) {
    let indexToBeShuffled = arr.length, toSwap, index;

    while (indexToBeShuffled) {
        // pick random element to shuffle
        index = Math.floor(Math.random() * indexToBeShuffled--);
        // swap elements from "front" of array to the "back"
        toSwap = arr[indexToBeShuffled];
        arr[indexToBeShuffled] = arr[index];
        arr[index] = toSwap;
    }

    return arr;
}

class Game {
    constructor(guess = null, past = []) {
        this.playersGuess = guess;
        this.pastGuesses = past;
        this.winningNumber = generateWinningNumber();
    }

    static newGame() {
        return new Game();
    }
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess - this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if (isNaN(guess) || guess < 1 || guess > 100) {
        throw 'That is an invalid guess.';
    }
    this.playersGuess = guess;
    return this.checkGuess(this.playersGuess);    
}

Game.prototype.checkGuess = function(guess) {
    if (guess === this.winningNumber) {
        return 'You Win!';
    }
    if (this.pastGuesses.includes(guess)) {
        return 'You have already guessed that number.';
    }
    this.pastGuesses.push(guess);
    if (this.pastGuesses.length === 5) {
        return 'You Lose.';
    }
    const guessDiff = this.difference();
    if (guessDiff < 10) return 'You\'re burning up!';
    if (guessDiff < 25) return 'You\'re lukewarm.';
    if (guessDiff < 50) return 'You\'re a bit chilly.';
    if (guessDiff < 100) return 'You\'re ice cold!';
}

Game.prototype.provideHint = function() {
    const hintArr = [this.winningNumber];
    while (hintArr.length < 3) {
        const newHint = generateWinningNumber();
        if (!hintArr.includes(newHint)) {
            hintArr.push(newHint);
        }
    }
    return shuffle(hintArr);
}
