import React from "react"

import "./WorldMap.css"
import getAPIKey from "../api"

const MAP_ID = "world-map"
const SUBMIT_ID = "submit-suggestion"

export default class WorldMap extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      map: null,
      destination: null,
      destinationLocation: {
        lat: 21.005853,
        lng: 105.822644
      },
      guessedPosition: null,
      overlay: null,
    }

  }

  componentDidMount() {
    const MAP_OPTIONS = {
      center: { lat: 0, lng: 0 },
      zoom: 3,
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
      /*global google*/
      let map = new google.maps.Map(document.getElementById(MAP_ID), MAP_OPTIONS)
      let marker = new google.maps.Marker({
        position: this.state.destinationLocation,
        map: map,
      })
      map.addListener('click' , e => {
        this.placeMarkerAtTo(e.latLng, map)
      })

      this.setState({
        map: map,
        destination: marker
      })

      class USGSOverlay extends google.maps.OverlayView {
        constructor(position, distance) {
          super()
          this.position = position
          this.distance = distance
        }

        /**
         * onAdd is called when the map's panes are ready and the overlay has been
         * added to the map.
         */
        onAdd() {
          this.div = document.createElement("div")
          this.div.style.borderStyle = "solid black"
          this.div.style.borderWidth = "0px"
          // this.div.style.position = "absolute"
          // Create the img element and attach it to the div.
          let text = document.createElement("span")
          text.innerText = this.distance

          this.div.appendChild(text)
          // Add the element to the "overlayLayer" pane.
          const panes = this.getPanes()
          panes.overlayLayer.appendChild(this.div)
        }

        /**
         * The onRemove() method will be called automatically from the API if
         * we ever set the overlay's map property to 'null'.
         */
        onRemove() {
          if (this.div) {
            this.div.parentNode.removeChild(this.div)
            delete this.div
          }
        }

        hide() {
          if (this.div) {
            this.div.style.visibility = "hidden"
          }
        }

        show() {
          if (this.div) {
            this.div.style.visibility = "visible"
          }
        }

        setPosition(position) {
          this.position = position
        }

        setDistance(distance) {
          this.distance = distance
        }
      }

      let overlay = new USGSOverlay(null, null)

      this.setState({
        overlay: overlay
      })

    }
    document.head.appendChild(script)
  }


  placeMarkerAtTo(latLng, map) {
    let marker = this.state.guessedPosition
    if (marker) {
      marker.setPosition(latLng)
    } else {
      marker = new google.maps.Marker({
        position: latLng,
        map: map,
      })
    }
    this.setState({
      guessedPosition: marker
    })
  }

  addDistanceAsText(distance) {
    let overlay = this.state.overlay
    let pos = this.state.guessedPosition.getPosition()
    let map = this.state.map

    if (overlay) {
      overlay.setDistance(distance)
      overlay.setPosition(pos)
      overlay.setMap(map)
    }

    this.setState({
      overlay: overlay
    })
  }

  drawDistance() {
    let poly = new google.maps.Polyline({
      strokeColor: "#000000",
      strokeOpacity: 1.0,
      strokeWeight: 3,
      map: this.state.map,
    })

    let path = [this.state.guessedPosition.getPosition(), this.state.destination.getPosition()]
    poly.setPath(path)
  }

  computeDistanceFrom() {
    let positionFrom = this.state.guessedPosition.getPosition()
    let positionTo = this.state.destination.getPosition()
    let distance = google.maps.geometry.spherical
      .computeDistanceBetween(positionFrom, positionTo)
    this.drawDistance()
    this.addDistanceAsText(distance)
  }

  submitSuggestion() {
    if (this.state.guessedPosition) this.computeDistanceFrom()
  }


  render() {
    return (
      <div>
        <div id={MAP_ID}></div>
        <div>
          <button onClick={() => { this.submitSuggestion() } } id={SUBMIT_ID}>Submit</button>
        </div>
      </div>
    )
  }
}
