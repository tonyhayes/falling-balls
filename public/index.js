'use strict'

// Get the elements that users can interact with
const score = document.querySelector('.dot-game-score p')
const slider = document.querySelector('.dot-game-slider')
const multiplier = document.querySelector('.dot-game-speed-multiplier')
let droppingInterval

// Application initial state
const state = {
  speed: 5,
  score: 0
}

// Application logic
slider.oninput = handleSliderChange
droppingInterval = startDropping()

// Helper functions
function handleSliderChange () {
  const speed = this.value
  setState({ speed })
  multiplier.innerHTML = `x${state.speed}`
}

function setState (newState) {
  Object.assign(state, newState)
}

// Ball factory function
function createBall () {
  const newBall = document.createElement("div")
  newBall.innerHTML = "<div class='dot-game-ball-score'></div>"

  // Get randomized styles
  const dimensions = generateRandomDimensions()
  const horizontal = generateRandomHorizontal()
  const color = generateRandomHex()

  // Initial ball state
  const ballState = {
    background: color,
    right: horizontal,
    width: `${dimensions}px`,
    height: `${dimensions}px`,
    top: `${200 - dimensions}px`,
    borderRadius: `${dimensions / 2}px`
  }

  Object.assign(newBall.style, ballState)
  newBall.className = 'dot-game-ball'

  // Compose ball functionality (composition over inheritance much more robust and scalable)
  return {
    initialize: () => {
      document.body.appendChild(newBall)
      newBall.addEventListener('click', () => {
        // Remove ball, drop additional single ball after 1000ms, and add score
        const points = getScore(dimensions)
        // Animate the score up (some pizzazz 😎)
        fireBallScore(Object.assign(newBall.getBoundingClientRect(), { dimensions, points }))
        newBall.remove()
        dropSingleBall()
        setScore(points)
      })
    },
    drop: () => {
      animate(state, newBall)
    }
  }
}

function animate ({ speed }, elem) {
  let interval
  interval = setInterval(() => {
    const elemTop = elem.getBoundingClientRect().top
    elem.style.top = `${elemTop + (state.speed / 10)}px`
    if (!elementIsInViewport(elem)) {
      elem.remove()
      clearInterval(interval)
    }
  }, 10)
}

function setScore (points) {
  setState({ score: state.score + points })
  score.innerHTML = state.score
}

function fireBallScore ({ top, right, left, dimensions, points }) {
  const firePoints = document.createElement("div")
  firePoints.innerHTML = points
  firePoints.className = 'dot-game-score-fire'
  document.body.appendChild(firePoints)
  Object.assign(firePoints.style, { top: `${top + (dimensions / 3)}px`, right: `${right}px`, left: `${left + (dimensions / 2)}px` })
  setTimeout(() => {
    firePoints.className += ' dot-game-show-points'
    firePoints.style.bottom = `${top + (dimensions / 3) - 10}px`
    firePoints.addEventListener("transitionend", function(event) {
      if (event.propertyName !== "opacity") firePoints.remove()
    }, false)
  }, 5)
}

function elementIsInViewport (elem) {
  const bounding = elem.getBoundingClientRect()
  return (
    bounding.top >= 0 &&
    bounding.left >= 0 &&
    bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
  )
}

function dropSingleBall () {
  setTimeout(() => {
    dropBall()
  }, 1000)
}

function startDropping () {
  return setInterval(() => {
    dropBall()
  }, 1000)
}

function dropBall () {
  const ball = createBall()
  ball.initialize()
  ball.drop()
}

function generateRandomDimensions () {
  return Math.floor((Math.random() * 10) + 1) * 10
}

function getScore (dimensions) {
  const num = (110 - dimensions).toString()
  console.log(num)
  console.log(dimensions)
  return +num.slice(0, num.length - 1)
}

function generateRandomHorizontal () {
  return `${(Math.random() * 10) * 10}vw`
}

function generateRandomHex () {
  return "#" + Math.random().toString(16).slice(2, 8)
}
