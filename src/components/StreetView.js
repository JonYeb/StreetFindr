import React from "react"

import getAPIKey from "../api"
//import getRandomInRange from "./helperFunctions"
import "./StreetView.css"

const STREET_VIEW = 'street-view'

let google, streetView

export default class StreetView extends React.Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const berkeley = { lat: 37.869085, lng: -122.254775 }
    const MAP_OPTIONS = {
      center: berkeley,
      zoom: 13,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl : false,
      rotateControl: false,
      gestureHandling: "greedy",
    }

    const API_KEY = getAPIKey()
    const MAP_LIBRARIES = [
      "geometry"
    ]

    let mapsURL = new URL("https://maps.googleapis.com/maps/api/js")
    mapsURL.searchParams.append('key', API_KEY)
    mapsURL.searchParams.append('callback', "initMap")
    mapsURL.searchParams.append('libraries', MAP_LIBRARIES.join(`,`))

    let script = document.createElement('script')
    script.src = mapsURL.href
    script.defer = true

    window.initMap = () => {
      google = window.google
      let map = new google.maps.Map(
        document.getElementById('map'),
        MAP_OPTIONS
      )
      let availableStreetViews = new google.maps.StreetViewCoverageLayer()
      availableStreetViews.setMap(map)
      window.availablemaps = availableStreetViews
      let streetViewService = new google.maps.StreetViewService()
      streetView = new google.maps.StreetViewPanorama(
        document.getElementById(STREET_VIEW),
        {
          addressControl: false,
          enableCloseButton: false,
          showRoadLabels: false
        }
      )
      streetViewService.getPanorama({
        location: berkeley,
        radius: 50,
        preference: "nearest",
        source: "outdoor"
      }, this.processServiceResponse)
    }

    document.head.appendChild(script)

  }

  processServiceResponse(data, status) {
    if (status === "OK") {
      const location = data.location

      streetView.setPano(location.pano)

      streetView.setVisible(true)

    } else {
      console.error("Street View data not found for this location.")
    }
  }

  render() {
    return (
      <div>
        <input type="file" id="input" />
        <div id="map"></div>
        <div id={STREET_VIEW}></div>
      </div>
    )
  }
}