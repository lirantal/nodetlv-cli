#!/usr/bin/env node

const path = require('path')
const soundPlayer = require('play-sound')()

const INTRO_FILE = path.join(__dirname, '../', 'assets', 'bensound-dubstep.mp3')

const soundHandler = soundPlayer.play(INTRO_FILE)

console.log('Nothing yet to see here...')
