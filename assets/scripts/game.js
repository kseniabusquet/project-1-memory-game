// TO DO:
// 1. Check sounds
// 3. Responsive design
// 3. Mobile version


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
    let timer = 5;

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
      roundResults.push({totalFlips: 998, totalTime: 998})    

      if (state.currentRound < maxRounds){
        const newLi = document.createElement("li");
        newLi.innerHTML = `
          <span class="lose-text">
              Round #${state.currentRound} lost :(
          </span>
      `
      alert('The time is over 😔')
      rounds.appendChild(newLi)
      resetGame();
     }
    
     else {
      newLi = document.createElement("li");
      newLi.innerHTML = `
      <span class="lose-text">
          Round #${state.currentRound} lost :(
      </span>
  `
    alert('The time is over 😔')
    rounds.appendChild(newLi)
    resetGame()
    checkMaxResets()
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
        timer = 5;
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
     else if ((roundResults[i].totalFlips <= roundResults[bestRound].totalFlips) && (roundResults[i].totalTime === roundResults[bestRound].totalTime) && (roundResults[i].totalTime !== 999)){
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
      const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="lose-text">
                Round #${state.currentRound} resetted
            </span>
        `
        rounds.appendChild(newLi)
        roundResults.push({totalFlips: 999, totalTime: 999})
        resetGame()
  }
    else if (state.currentRound >= maxRounds) {
      const newLi = document.createElement("li");
        newLi.innerHTML = `
            <span class="lose-text">
                Round #${state.currentRound} resetted
            </span>
        `
        rounds.appendChild(newLi)
        roundResults.push({totalFlips: 999, totalTime: 999})
        checkMaxResets()
        state.currentRound++
    }
  }

 function checkMaxResets(){
  if ((roundResults[0].totalTime === 999) && (roundResults[1].totalTime === 999) && (roundResults[2].totalTime === 999)){
    setTimeout(() => {
      start.classList.add('inactive')
      alert("Maximum number of resets reached")
      }, 500)
      const newItem = document.createElement("span");
        newItem.innerText = `
                Game lost. Please try again 😉
        `
        results.appendChild(newItem)
  }
  else if (((roundResults[0].totalTime === 998) || (roundResults[0].totalTime === 999)) 
  && ((roundResults[1].totalTime === 998) || (roundResults[1].totalTime === 999)) 
  && ((roundResults[2].totalTime === 998) || (roundResults[2].totalTime === 999))){
    const newItem = document.createElement("span");
        newItem.innerText = `
                Game lost. Please try again 😉
        `
        results.appendChild(newItem)
  }
  
  else checkBestRound()
  resetGame()
  restartGame()
}


window.onload = shuffle();
cards.forEach(card => card.addEventListener('click', flipCard));
start.addEventListener('click', startGame)
reset.addEventListener('click', checkReset)