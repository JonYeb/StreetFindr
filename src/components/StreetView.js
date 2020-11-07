import React from "react"
import PropTypes from "prop-types"

import {getRandomInRange} from "./helperFunctions"
import {countries} from "../Assets/countriesByBounds"
import "./StreetView.css"

const STREET_VIEW = 'street-view'
const SEED_APPEND = 'street-findr_seed-append'
const MAX_DEPTH = 20


let google, streetView, streetViewService
let current_depth = 0

export default class StreetView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      seed: ''
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
    //return {lat: 46.3, lng: 47.11}
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
          <button onClick={() => this.setStreetViewLocation()} id="game-start">start game</button>
        </div>
        <div id={STREET_VIEW}></div>
      </div>
    )
  }
}