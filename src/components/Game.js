import React from "react"
import WorldMap from "./WorldMap"
import StreetView from "./StreetView"
import getAPIKey from "../api"

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loadStreetView: false,
      startingLocations: {lat:0,lng:0}
    }
  }

  componentDidMount() {
    const API_KEY = getAPIKey()
    const MAP_LIBRARIES = [
      "geometry"
    ]

    let mapsURL = new URL("https://maps.googleapis.com/maps/api/js")
    mapsURL.searchParams.append('key', API_KEY)
    mapsURL.searchParams.append('callback', "loadedMaps")
    mapsURL.searchParams.append('libraries', MAP_LIBRARIES.join(`,`))

    let script = document.createElement('script')
    script.src = mapsURL.href
    script.defer = true

    window.loadedMaps = () => {
      this.setState({
        loadStreetView: true
      })
    }

    document.head.appendChild(script)

  }

  setStartingLocation(location) {
    let startingLocations = this.state.startingLocations
    startingLocations = location
    this.setState({
      startingLocations: startingLocations
    })
  }

  render() {
    let loadStreetView = this.state.loadStreetView
    if (loadStreetView) {
      return (
        <div>
          <div>
            <WorldMap destination={this.state.startingLocations} />
          </div>
          <div><StreetView setLocation={(location) => this.setStartingLocation(location)} /></div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}