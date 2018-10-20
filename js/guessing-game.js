// Begin Guessing Game Code
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
        this.hintArr = [];
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
    if (this.pastGuesses.includes(guess)) {
        return 'You have already guessed that number.';
    }
    this.pastGuesses.push(guess);
    if (guess === this.winningNumber) {
        return 'You Win! 😁';
    }
    if (this.pastGuesses.length === 5) {
        return 'You Lose ☹️';
    }
    const guessDirection = guess > this.winningNumber ? `Guess lower.` : `Guess higher.`;
    const guessDiff = this.difference();
    if (guessDiff < 10) return 'You\'re burning up! ' + guessDirection;
    if (guessDiff < 25) return 'You\'re lukewarm. ' + guessDirection;
    if (guessDiff < 50) return 'You\'re a bit chilly. ' + guessDirection;
    if (guessDiff < 100) return 'You\'re ice cold! ' + guessDirection;
}

Game.prototype.provideHint = function() {
    if (this.hintArr.length > 0) return this.hintArr;

    const newHintArr = [this.winningNumber];
    while (newHintArr.length < (7 - this.pastGuesses.length)) {
        const newHint = generateWinningNumber();
        if (!newHintArr.includes(newHint) && !this.pastGuesses.includes(newHint)) {
            newHintArr.push(newHint);
        }
    }
    this.hintArr = shuffle(newHintArr);
    return this.hintArr;
}

// Implementation of Guessing Game 

let game = new Game();
let status = document.getElementById('gameState');
let choiceOfGuesses = [];   // collection of all number choice buttons
for (let i = 1; i <= 100; i++) {
    let currentNumber = document.getElementById(`square${i}`);
    currentNumber.addEventListener('click', () => {
        if (game.pastGuesses.length < 5 && !game.pastGuesses.includes(game.winningNumber)) {
            status.innerHTML = game.playersGuessSubmission(parseInt(currentNumber.value, 10));
            currentNumber.disabled = true;
            $(`#displayGuessBox${game.pastGuesses.length}`).html(game.playersGuess);
            if (game.playersGuess === game.winningNumber) {
                $(`#displayGuessBox${game.pastGuesses.length}`).addClass('isWinningNumber');
            } else {
                $(`#displayGuessBox${game.pastGuesses.length}`).addClass('isNotWinningNumber');
            }
        }
    })
    choiceOfGuesses.push(currentNumber);
}

let hintBtn = document.getElementById('getHint');
hintBtn.addEventListener('click', () => {
    if (game.pastGuesses.length < 5) {
        game.provideHint();
        game.hintArr.forEach(e => {
            $(`#square${e}`).addClass('isHint');
        });
        hintBtn.disabled = true;
    }
});
let newGameBtn = document.getElementById('newGame');
newGameBtn.addEventListener('click', () => {
    game = new Game();
    status.innerHTML = 'Guess a Number Between 1-100!';
    choiceOfGuesses.forEach(btn => {
        btn.disabled = false;
        $(btn).removeClass('isHint');
    });
    hintBtn.disabled = false;
    // clear out past guesses
    for (let i = 1; i < 6; i++) {
        $(`#displayGuessBox${i}`).html('');
        $(`#displayGuessBox${i}`).removeClass('isWinningNumber');
        $(`#displayGuessBox${i}`).removeClass('isNotWinningNumber');
    }
    
});

