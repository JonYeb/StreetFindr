import React from "react"
import WorldMap from "./WorldMap"
import StreetView from "./StreetView"
import getAPIKey from "../api"

export default class Game extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false
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
        loaded: true
      })
    }

    document.head.appendChild(script)

  }

  render() {
    let loaded = this.state.loaded
    if (loaded) {
      return (
        <div>
          <div><WorldMap/></div>
          <div><StreetView/></div>
        </div>
      )
    } else {
      return (<div></div>)
    }
  }
}