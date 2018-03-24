import React, { Component } from 'react'
import { observer, inject } from 'mobx-react/native'
import { LocalStorage } from '../../store/localStorage'
import axios from 'axios'
import Settings from '../../models/Settings'
// custom components
import Login from '../Login'
import AlarmButton from '../AlarmButton'
import SettingsControls from '../Settings'
// styled Components
import StyledView from './StyledView'
// custom functions that do not set state
import shareAlarm from '../../functions/shareAlarm'

interface Props {
  localStorage?: LocalStorage
}
interface State {
  accessToken: string,
  geolocation: {
    lat: number,
    long: number
  },
  error: string,
  settings: Settings

}
@inject('localStorage')
@observer
export default class SafeTrek extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      accessToken : undefined,
      geolocation: {
        lat : undefined,
        long: undefined
      },
      error: undefined,
      settings: {
        shareLocation: false
      }
    }
  }
  componentDidMount () {

    this.props.localStorage.getSettings()
    .then((savedSettings) => {
      console.log(savedSettings)
      if (savedSettings) {
        this.setState({settings: savedSettings})
      } else {
        alert('No settings saved yet')
      }
    })
    .catch(e => alert(e))

  }

  updateToken = (token: string): void => {
    this.setState({accessToken: token})
  }
  triggerAlarm = (): void => {
    if (this.state.settings.shareLocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
        this.setState({
          geolocation: {lat: position.coords.latitude, long: position.coords.longitude}
        })
        const {geolocation} = this.state
        shareAlarm(geolocation)
        },
        (error) => this.setState({error: error.message}),
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      )
    } else {
      shareAlarm()
    }
  }
  updateLocationSharing = (): void => {
    this.setState({settings: {shareLocation: !this.state.settings.shareLocation}}, () => {
      console.log('New location settings: ' + this.state.settings.shareLocation)
      this.props.localStorage.updateSettings(this.state.settings).then(() => {
        this.props.localStorage.getSettings()
        .then((savedSettings) => {
          console.log('After updating settings: ' + savedSettings.shareLocation)
          if (savedSettings) {
            this.setState({settings: savedSettings})
          } else {
            alert('No settings saved yet')
          }
        })
        .catch(e => alert(e))
       })
    })
  }

  render() {

    return (
      <StyledView>
        {
          !this.state.accessToken
          ? <Login
            accessToken={this.state.accessToken}
            onTokenUpdate={this.updateToken}/>
          : <AlarmButton onAlarmTriggered={this.triggerAlarm} />

        }
        <SettingsControls shareLocation={this.state.settings.shareLocation} onChange={this.updateLocationSharing}/>
      </StyledView>
    )
  }
}
