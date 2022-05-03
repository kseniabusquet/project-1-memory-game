// 1. One player X
// 2. 12 cards in total X
// 3. Shuffle cards before start X
// 4. The game start after pressing the START button X
// 5. The game can be resetted by pressing the RESET button X
// 6. The countdown timer starts with the game start X
// 7. The moves counter starts with the game start X
// 8. Player chooses 2 cards and tries to find 2 cards which are exactly the same X
// 9. If the cards are a match, they will be kept flipped over X
// 10. If the cards are NOT a match, they will be flipped back again X
// 11. The game continues until all the the cards have been paired up X
// 12. When finished, the results will be shown with the total time spent and the number of moves X
// 13. The results will be added to the left side of the page with a round number accordingly X

//TODO:

//1. Reset board after win 
//2. Set the maximal rounds number
//3. The maximum of 3 rounds can be played, after this the game will be resetted 
//4. After the 3 rounds, the best score will be displayed

// setTimeOut !!!
//currentRound === maxRounds??


const cards = document.querySelectorAll('.card');
const moves = document.querySelector('.moves')
const start = document.getElementById('start')
const reset = document.getElementById('reset')
const memoryGame = document.querySelector('.memory-game')
const win = document.querySelector('.win')
const results = document.querySelector('.results')
const rounds = document.querySelector('.rounds')
const timeLeft = document.querySelector('.time-left')
const bestRoundContainer = document.querySelector('.best-round-container')

const bgAudio = document.getElementById("bg-audio")
const winAudio = document.getElementById("win-audio")
const loseAudio = document.getElementById("lose-audio")

const maxRounds = 2

let roundResults = []

const state = {
    gameStarted: false,
    totalFlips: 0,
    totalTime: 0,
    loop: null,
    currentRound: 1
}

let hasFlippedCard = false;
let lockBoard = false;
let firstCard, secondCard;

function computeTwoDigitNumber(value) {
    return value.toString().padStart(2, '0')
  }


//the timer and move counter will start only after clicking the START button
const startGame = () => {
    state.gameStarted = true
    bgAudio.play()

    //grey out the START button
    start.classList.add('inactive')

    let minutes, seconds;
    let timer = 40;

    state.loop = setInterval(() => {
        
        if (--timer >= 0) {
        state.totalTime++
        moves.innerText = `Moves: ${state.totalFlips}`

        minutes = computeTwoDigitNumber(parseInt(timer / 60, 10));
        seconds = computeTwoDigitNumber(parseInt(timer % 60, 10));

        timeLeft.textContent = `Time left: ${minutes}:${seconds}`; 

    } else {

      bgAudio.pause();
      loseAudio.play();

roundResults.push({totalFlips: state.totalFlips, totalTime: state.totalTime})

      setTimeout(() => {
      alert("Game over ☹️")

      const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="lose-text">
                Round lost :(
            </span>
        `
        rounds.appendChild(newLi)
      }, 500)

      
      checkBestRound();
      resetGame();

    }
        
    }, 1000)
}

const resetGame = () => {

        cards.forEach(card => card.classList.remove('flip'))

        start.classList.remove('inactive')
        timeLeft.textContent = "Time left: 00:05";
        timer = 40;
        start.classList.remove('inactive')

        state.totalFlips = 0
        moves.innerText = `Moves: ${state.totalFlips}`
        state.totalTime = 0
        state.gameStarted = false;
        state.currentRound++; 
       
       
        clearInterval(state.loop)
        bgAudio.pause()
        unflipCards()
        shuffle()
        resetBoard()
}

function flipCard() {
    if (state.gameStarted === false) {
        alert("Please press the START button to start the game 🤗");
        return;
    }
    if (lockBoard) return;
    if (this === firstCard) return;

    state.totalFlips++;

    this.classList.add('flip');
 
    if (!hasFlippedCard) {
      hasFlippedCard = true;
      firstCard = this;
      return;
    }

    secondCard = this;

   checkForMatch();

   // If there are no more cards that we can flip, we won the game
    if (document.querySelectorAll('.card.flip').length === 12) {
        
      //stop the audio
        bgAudio.pause()

        //play the win audio
        winAudio.play();
        setTimeout(() => {
        const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="win-text">
                Round completed with <span>${state.totalFlips}</span> moves<br />
                under <span>${state.totalTime}</span> seconds
            </span>
        `
        rounds.appendChild(newLi)
        roundResults.push({totalFlips: state.totalFlips, totalTime: state.totalTime})


        if (state.currentRound > maxRounds) {

          checkBestRound();
          restartGame()
        }

        resetGame();

        //start over again
        cards.forEach(card => card.classList.remove('flip'))
        cards.forEach(card => card.addEventListener('click', flipCard));

    }, 1000)

    
 }
}

 function checkForMatch() {
   if (firstCard.dataset.framework === secondCard.dataset.framework) {
     disableCards();
     return;
   }

   unflipCards();
 }

 function disableCards() {
   firstCard.removeEventListener('click', flipCard);
   secondCard.removeEventListener('click', flipCard);

   resetBoard();
 }

 function unflipCards() {
     lockBoard = true;
     
     setTimeout(() => {
     firstCard.classList.remove('flip');
     secondCard.classList.remove('flip');

     resetBoard();
   }, 1500);
 }

function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

function shuffle() {
    cards.forEach(card => {
      let randomPos = Math.floor(Math.random() * 12);
      card.style.order = randomPos;
    });
  };


function checkBestRound(){

  console.log(roundResults)

  let minMovesRound = roundResults.indexOf(minMoves)+1

  //reduce : comparar objeto (!!!!) atual com objeto anterior


    const newItem = document.createElement("span");
        newItem.innerText = `
                The round with the best results: round #${minMovesRound} with ${minMoves} moves
        `
        results.appendChild(newItem)
  }

  function restartGame(){
    //div display none
    memoryGame.innerHTML = "<img src=\"https://i.gifer.com/Ioci.gif\">"
    start.removeEventListener("click", startGame)
    reset.removeEventListener("click", resetGame)
  }


window.onload = shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
start.addEventListener("click", startGame)
reset.addEventListener("click", resetGame)