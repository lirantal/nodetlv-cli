import React, { Component } from 'react'
import blessed from 'blessed'
import { render } from 'react-blessed'
import { Grid, GridItem, Donut, Sparkline, Lcd, Map } from 'react-blessed-contrib'

const lcdColors = ['red', 'green', 'blue']

class App extends Component {
  constructor() {
    super()
    this.state = {
      lcdValue: 0,
      headingTextColor: 'white',
      headingTextColorIndex: 0,
      percentDevelopers: 0.0,
      percentConferenceDays: 0.0,
      percentSpeakers: 0.0,
      percentTheme: 0.0,
      percentDrawnItems: 0,
      headingDrawn: false,
      titleDrawn: false,
      titleText: 'Speakers from all over the world',
      mapVisible: false,
      current_mode: 1
    }
  }

  componentDidMount() {
    const screen = this.props.screen
    const sparkline1 = this.refs.sparkline1.widget
    const sparkline2 = this.refs.sparkline2.widget

    const spark1 = [1, 2, 5, 2, 4, 1, 2]
    const spark2 = [4, 4, 5, 4, 1, 5, 1]
    refreshSpark()
    setInterval(refreshSpark, 150)

    function refreshSpark() {
      spark1.shift()
      spark1.push(Math.random() * 5 + 1)
      spark2.shift()
      spark2.push(Math.random() * 5 + 1)
      sparkline1.setData([' '], [spark1])
      sparkline2.setData([' '], [spark2])
      screen.render()
    }

    setTimeout(() => {
      this.setState({ headingDrawn: true })
    }, 800)

    setTimeout(() => {
      this.setState({ titleDrawn: true })
    }, 1600)

    setTimeout(() => {
      const timerPercentDevelopers = setInterval(() => {
        this.setState({ percentDevelopers: this.state.percentDevelopers + 8 }, () => {
          if (this.state.percentDevelopers > 100) {
            clearInterval(timerPercentDevelopers)
          }
        })
        screen.render()
      }, 150)

      const timerPercentConferenceDays = setInterval(() => {
        this.setState({ percentConferenceDays: this.state.percentConferenceDays + 8 }, () => {
          if (this.state.percentConferenceDays > 100) {
            clearInterval(timerPercentConferenceDays)
          }
        })
      }, 120)

      const timerPercentSpeakers = setInterval(() => {
        this.setState({ percentSpeakers: this.state.percentSpeakers + 8 }, () => {
          if (this.state.percentSpeakers > 100) {
            clearInterval(timerPercentSpeakers)
          }
        })
      }, 170)

      const timerPercentTheme = setInterval(() => {
        this.setState({ percentTheme: this.state.percentTheme + 8 }, () => {
          if (this.state.percentTheme >= 100) {
            clearInterval(timerPercentTheme)
          }
        })
      }, 190)
    }, 1600)

    const lcdLineOne = this.refs.lcdLineOne.widget
    setInterval(() => {
      const randomColorIndex = Math.floor(Math.random() * lcdColors.length)
      lcdLineOne.setDisplay(this.props.headingText)
      lcdLineOne.setOptions({
        color: lcdColors[randomColorIndex]
      })
    }, 180)

    setInterval(() => {
      this.setState({
        mapVisible: !this.state.mapVisible
      })
    }, 5500)

    setInterval(() => {
      const map = this.refs.map.widget
      map.addMarker({ lon: '34.781769', lat: '32.085300', color: 'red', char: 'X' })
      screen.render()
    }, 5780)

    setInterval(() => {
      const map = this.refs.map.widget
      map.addMarker({ lon: '133.775131', lat: '-25.274399', color: 'red', char: 'X' })
      screen.render()
    }, 5890)
  }

  render() {
    const percentTheme = this.state.percentTheme >= 100 ? 100 : this.state.percentTheme

    let title = <element></element>
    if (this.state.headingDrawn) {
      let titleText = this.props.titleText
      if (this.state.mapVisible) {
        titleText = this.state.titleText
      }

      title = (
        <GridItem
          row={4}
          col={0}
          rowSpan={2}
          colSpan={12}
          component={'box'}
          options={{
            content: this.state.mapVisible
              ? this.state.titleText
              : this.props.titleText + '\n' + this.props.titleTextSubheader,
            style: { color: 1, border: { fg: 1 } },
            align: 'center'
          }}
        />
      )
    }

    let donuts = <element></element>
    if (this.state.titleDrawn) {
      donuts = (
        <Donut
          key={1}
          row={5}
          col={1}
          rowSpan={5}
          colSpan={11}
          {...{
            radius: 8,
            spacing: 10,
            arcWidth: 3,
            style: { border: { fg: 1 } },
            label: '',
            data: [
              {
                percentAltNumber: 800,
                percent: this.state.percentDevelopers,
                label: 'Developers',
                color: 'magenta'
              },
              {
                percentAltNumber: 1,
                percent: this.state.percentConferenceDays,
                label: 'Day conference',
                color: 'blue'
              },
              {
                percentAltNumber: 22,
                percent: this.state.percentSpeakers,
                label: 'Speakers',
                color: 'red'
              },
              { percent: percentTheme, label: 'Node.js', color: 'green' }
            ]
          }}
        />
      )
    }

    return (
      <Grid rows={12} cols={12} hideBorder={true}>
        <Lcd
          ref="lcdLineOne"
          row={0}
          col={2}
          rowSpan={4}
          colSpan={8}
          {...{
            elements: 8,
            color: this.state.headingTextColor,
            label: this.state.lcdValue,
            display: this.props.headingText
          }}
        />

        {title}

        <Sparkline
          ref="sparkline1"
          row={2}
          col={0}
          rowSpan={3}
          colSpan={2}
          {...{
            label: '',
            tags: true,
            align: 'center',
            style: { fg: 'blue', titleFg: 'white', border: { fg: 0 }, align: 'center' }
          }}
        />
        <Sparkline
          ref="sparkline2"
          row={2}
          col={10}
          rowSpan={3}
          colSpan={2}
          {...{
            label: '',
            tags: true,
            align: 'center',
            style: { fg: 'blue', titleFg: 'white', border: { fg: 0 }, align: 'center' }
          }}
        />

        {this.state.mapVisible ? (
          <Map ref="map" row={5} col={1} rowSpan={6} colSpan={11} label="" />
        ) : (
          donuts
        )}

        <GridItem
          row={10}
          col={0}
          rowSpan={2}
          colSpan={12}
          component={'box'}
          options={{
            content: '-=- powered by Node.js-IL and EventHandler -=-',
            style: { color: 1, border: { fg: 0 } },
            align: 'center'
          }}
        />

        <GridItem
          row={11}
          col={this.props.listBarWidth}
          rowSpan={2}
          colSpan={10}
          component={'listbar'}
          options={{
            keys: true,
            mouse: true,
            focused: true,
            commands: { Agenda: {}, 'Submit a CFP': {}, 'Get your tickets!': {}, Website: {} },
            style: {
              item: {
                bg: 'gray',
                fg: 'white',
                hover: {
                  bg: 'white',
                  fg: 'black'
                },
                focus: {
                  bg: 'white',
                  fg: 'black'
                }
              },
              selected: {
                bg: 'white',
                fg: 'black'
              },
              border: { fg: 0 }
            }
          }}
        />
      </Grid>
    )
  }
}

function renderApp() {
  const screen = blessed.screen({
    title: 'NODE TLV',
    dockBorders: true,
    autoPadding: true,
    smartCSR: true,
    fastCSR: true,
    ignoreDockContrast: true
  })
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0)
  })

  let listBarWidth = 1
  if (screen.width >= 85) {
    listBarWidth = 2
  }
  if (screen.width >= 115) {
    listBarWidth = 3
  }
  if (screen.width >= 140) {
    listBarWidth = 4
  }

  render(
    <App
      headingText="NODE TLV"
      titleText="International Node.js Conference in Tel Aviv"
      titleTextSubheader="November 14-15, 2021"
      listBarWidth={listBarWidth}
      screen={screen}
    />,
    screen
  )
}

exports.renderApp = renderApp
