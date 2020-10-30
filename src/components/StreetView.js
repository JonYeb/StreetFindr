import React from "react"

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

    google = window.google

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
        <div id={STREET_VIEW}></div>
      </div>
    )
  }
}