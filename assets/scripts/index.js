const boardContainer = document.querySelector('.board-container')
const board = document.querySelector('.board')
const moves = document.querySelector('.moves')
const timer = document.querySelector('.timer')
const start = document.querySelector('button')
const win = document.querySelector('.win')
const winAudio = document.getElementById("win-audio")
const loseAudio = document.getElementById("lose-audio")
const bgAudio = document.getElementById("bg-audio")
const btnMusic = document.getElementById("complete-audio")

const game = new MemoryGame

