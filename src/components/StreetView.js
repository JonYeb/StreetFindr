import React from "react"
import PropTypes from "prop-types"

import {getRandomInRange} from "./helperFunctions"
import {countries} from "../Assets/countriesByBounds"
import "./StreetView.css"

const STREET_VIEW = 'street-view'

let google, streetView, streetViewService

export default class StreetView extends React.Component {
  constructor(props) {
    super(props)
  }

  static get propTypes() {
    return {
      setLocation: PropTypes.func
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
    this.setStreetViewLocation()
  }

  setStreetViewLocation() {
    let location = this.getRandomStartingLocation()
    streetViewService.getPanorama({
      location: location,
      radius: 10000,
      preference: "nearest",
      source: "outdoor"
    }, (data, status) => {
      if (status === "OK") {
        const locationData = data.location
        streetView.setPano(locationData.pano)
        streetView.setVisible(true)
        this.props.setLocation(location)
      } else {
        this.setStreetViewLocation()
      }
    })
  }

  getRandomStartingLocation() {
    //return {lat: 46.3, lng: 47.11}
    let length = countries.length
    let [
      country, continent,
      maxlatitude, minlatitude,
      maxlongitude, minlongitude
    ] = countries[getRandomInRange(1, length - 1, 0)]

    return {
      lat: getRandomInRange(parseFloat(minlatitude), parseFloat(maxlatitude), 3),
      lng: getRandomInRange(parseFloat(minlongitude), parseFloat(maxlongitude), 3)
    }
  }

  render() {
    return (
      <div>
        <div id={STREET_VIEW}></div>
      </div>
    )
  }
}