const path = require('path')
const ProgressBar = require('cli-progress')
const colors = require('colors')
const soundPlayer = require('play-sound')()

const { renderApp } = require('./app.js')
const INTRO_MUSIC_FILE = path.join(__dirname, '../', 'assets', 'bensound-dubstep.mp3')
const TIMER_SKIPS_MUSIC_LOADER = 18
const TIMER_SKIPS_VIBES_LOADER = 14

function musicLoader() {
  return new Promise((resolve, reject) => {
    const progressBar = new ProgressBar.Bar({
      format: `Loading music      | ${colors.cyan('{bar}')} | {percentage}%`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: false
    })

    let value = 2
    progressBar.start(200, 0)
    const progressBarTimer = setInterval(() => {
      value++
      progressBar.update(value)
      if (value >= progressBar.getTotal()) {
        clearInterval(progressBarTimer)
        progressBar.stop()
        return resolve()
      }
    }, TIMER_SKIPS_MUSIC_LOADER)
  })
}

function goodVibesLoader() {
  return new Promise((resolve, reject) => {
    const progressBar = new ProgressBar.Bar({
      format: `Loading good vibes | ${colors.magenta('{bar}')} | {percentage}%`,
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: false
    })

    let value = 2
    progressBar.start(200, 0)
    const progressBarTimer = setInterval(() => {
      value++
      progressBar.update(value)
      if (value >= progressBar.getTotal()) {
        clearInterval(progressBarTimer)
        progressBar.stop()
        return resolve()
      }
    }, TIMER_SKIPS_VIBES_LOADER)
  })
}

async function init() {
  await musicLoader()
  const soundHandler = soundPlayer.play(INTRO_MUSIC_FILE)
  await goodVibesLoader()

  renderApp()

  process.on('exit', () => {
    soundHandler.kill()
  })

  process.on('unhandledRejection', () => {
    soundHandler.kill()
  })
}

init()
