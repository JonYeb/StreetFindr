import React from "react"
import PropTypes from "prop-types"

import {getRandomInRange} from "./helperFunctions"
import {countries} from "../Assets/countriesByBounds"
import "./StreetView.css"

const STREET_VIEW = 'street-view'
const SEED_APPEND = 'street-findr_seed-append'
const MAX_DEPTH = 20
const MIN_TIME = 30


let google, streetView, streetViewService
let current_depth = 0

export default class StreetView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seed: '',
    }
  }

  static get propTypes() {
    return {
      setLocation: PropTypes.func,
    }
  }

  componentDidMount() {
    google = window.google

    streetViewService = new google.maps.StreetViewService()
    streetView = new google.maps.StreetViewPanorama(
      document.getElementById(STREET_VIEW),
      {
        addressControl: false,
        enableCloseButton: false,
        showRoadLabels: false
      }
    )
  }

  finishGame() {
    alert('finish')
    document.getElementById('submit-suggestion').click()
  }

  setStreetViewLocation() {
    current_depth += 1
    let location = this.getRandomStartingLocation()
    console.log(location)
    streetViewService.getPanorama({
      location: location,
      radius: 10000,
      preference: "nearest",
      source: "outdoor"
    }, (data, status) => {
      if (current_depth > MAX_DEPTH) {
        current_depth = 0
        alert('bad seed, choose a new one')
        this.setState({
          seed: ''
        })
        return
      }
      if (status === "OK") {
        current_depth = 0
        const locationData = data.location
        streetView.setPano(locationData.pano)
        streetView.setVisible(true)
        this.props.setLocation(location)
        const TIMED_GAME = document.getElementById('game-timed')
        if (TIMED_GAME.checked) {
          const TIME_FIELD = document.getElementById('game-timer')
          let time = parseInt(TIME_FIELD.value)
          let countdown = (time < MIN_TIME ? MIN_TIME : time)
          countdown *= 1000
          window.setTimeout( () => {
            this.finishGame()
          }, countdown)
        }
      } else {
        let oldSeed = this.state.seed
        let seedArray = oldSeed.split("")
        seedArray.push(seedArray.shift())
        this.setState({
          seed: seedArray.join().replaceAll(",", "")
        })
        this.setStreetViewLocation()
      }
    })
  }

  getRandomStartingLocation() {
    let seed = this.state.seed
    if (!seed) {
      seed = document.getElementById('game-seedrandom').value + SEED_APPEND
      this.setState({
        seed
      })
    }
    console.log(seed)
    return {lat: 46.3, lng: 47.11}
    let length = countries.length
    let [
      country, continent,
      maxlatitude, minlatitude,
      maxlongitude, minlongitude
    ] = countries[getRandomInRange(1, length - 1, 0, seed)]

    console.log(country)
    return {
      lat: getRandomInRange(parseFloat(minlatitude), parseFloat(maxlatitude), 3, seed),
      lng: getRandomInRange(parseFloat(minlongitude), parseFloat(maxlongitude), 3, seed)
    }
  }

  render() {
    return (
      <div>
        <div>
          <label htmlFor="game-seedrandom">Seed for start</label>
          <input type="text" id="game-seedrandom" />
        </div>
        <div>
          <label htmlFor="game-timed">Activate timer?</label>
          <input type="checkbox" id="game-timed" />
          <label htmlFor="game-timer">Timelimit</label>
          <input id="game-timer" type="number" step="1" min={MIN_TIME} />
          <div>

          </div>
        </div>
        <div>
          <button onClick={() => this.setStreetViewLocation()} id="game-start">start game</button>
        </div>
        <div id={STREET_VIEW}></div>
      </div>
    )
  }
}