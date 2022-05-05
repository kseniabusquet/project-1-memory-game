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

//1. Fix RESET button
//2. Fix best round number logic

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
const gif = document.querySelector('.gif')

const bgAudio = document.getElementById("bg-audio")
const winAudio = document.getElementById("win-audio")
const loseAudio = document.getElementById("lose-audio")

const maxRounds = 3

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

    } 
    
    else {
      
      bgAudio.pause();
      loseAudio.play();

      roundResults.push({totalFlips: state.totalFlips, totalTime: state.totalTime})
    

      if (state.currentRound < maxRounds){
        const newLi = document.createElement("li");
        newLi.innerHTML = `
          <span class="lose-text">
              Round #${state.currentRound} lost :(
          </span>
      `
      rounds.appendChild(newLi)
      resetGame();
      alert("Game over ☹️")
     }
    else {
    newLi = document.createElement("li");
    newLi.innerHTML = `
      <span class="lose-text">
          Round #${state.currentRound} lost :(
      </span>
  `
    rounds.appendChild(newLi)
    resetGame()
    restartGame()
     }   
    }
  }, 1000)

  }

const resetGame = () => {

        cards.forEach(card => card.classList.remove('flip'))
        cards.forEach(card => card.addEventListener('click', flipCard));
        start.classList.remove('inactive')
        timeLeft.textContent = "Time left: 00:40";
        timer = 40;
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
        bgAudio.pause()
        winAudio.play();
        setTimeout(() => {
        const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="win-text">
                Round #${state.currentRound} completed with <span>${state.totalFlips}</span> moves<br />
                under <span>${state.totalTime}</span> seconds
            </span>
        `
        rounds.appendChild(newLi)
        roundResults.push({totalFlips: state.totalFlips, totalTime: state.totalTime})

        if (state.currentRound < maxRounds) {
          resetGame();

          cards.forEach(card => card.classList.remove('flip'))
          cards.forEach(card => card.addEventListener('click', flipCard))

        }

        else {
          reset.classList.add('inactive')
          reset.removeEventListener('click', checkReset)
          checkBestRound();
          resetGame()
          restartGame()
        }

        

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
  let bestRound = 0

  for (i = 1; i < roundResults.length; i++){
    if ((roundResults[i].totalFlips <= roundResults[bestRound].totalFlips) && (roundResults[i].totalTime < roundResults[bestRound].totalTime)) {
      bestRound = i
     }

     else if ((roundResults[i].totalFlips <= roundResults[bestRound].totalFlips) && (roundResults[i].totalTime === roundResults[bestRound].totalTime)){
      const newItem = document.createElement("span");
      newItem.innerText = `
              There is more than one round with the best results: round #${bestRound+1} and round #${i+1} with ${roundResults[i].totalFlips} moves under ${roundResults[i].totalTime} seconds
      `
      results.appendChild(newItem)

      return
     } 
    }

    const newItem = document.createElement("span");
        newItem.innerText = `
                The round with the best results: round #${bestRound+1} with ${roundResults[bestRound].totalFlips} moves under ${roundResults[bestRound].totalTime} seconds
        `
        results.appendChild(newItem)
  }

  function restartGame(){
    memoryGame.classList.add('hidden')
    gif.classList.remove('hidden')
    start.removeEventListener('click', startGame)
    start.classList.add('inactive')
    reset.removeEventListener('click', resetGame)
    reset.classList.add('inactive')

  }

  function checkReset(){

    if (state.currentRound < maxRounds) {
      console.log('current round: ' + state.currentRound )
      const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="lose-text">
                Round #${state.currentRound} resetted
            </span>
        `
        rounds.appendChild(newLi)
        resetGame()
  }
    else if (state.currentRound >= maxRounds) {
      console.log('current round: ' + state.currentRound )

      const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="lose-text">
                Round #${state.currentRound} resetted
            </span>
        `
        rounds.appendChild(newLi)

        resetGame()
        restartGame()

      setTimeout(() => {
        start.classList.add('inactive')
        alert("Maximum number of resets reached")
        }, 500)





      //stop timer
    }
  }


window.onload = shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
start.addEventListener('click', startGame)
reset.addEventListener('click', checkReset)