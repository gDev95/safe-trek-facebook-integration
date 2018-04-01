import React, { Component } from 'react'
import { Image } from 'react-native'
import { observer, inject } from 'mobx-react/native'
import axios from 'axios'
import { LoginManager, AccessToken } from 'react-native-fbsdk'
import { ShareApi } from 'react-native-fbsdk'
import { Linking } from 'react-native'

// store
import { LocalStorage } from '../../store/localStorage'
// custom models
import Settings from '../../models/Settings'
import { SafeTrekToken } from '../../models/Rest'
import Geolocation from '../../models/Geolocation'
// custom components
import AlarmButton from '../AlarmButton'
import SettingsControls from '../Settings'
// styled Components
import StyledView from './StyledView'
// import secrets, keys and ids
import {
  SafeTrekClientId,
  SafeTrekClientSecret,
  GoogleApiKey
} from '../../../secrets.js'

const logo = require('../../../safetrek-logo.png')
interface Props {
  localStorage?: LocalStorage
}

interface State {
  facebookToken: string,
  geolocation: Geolocation
  settings: Settings,
  safeTrekToken: SafeTrekToken,
  alarmCreated: boolean

}
@inject('localStorage')
@observer
export default class SafeTrek extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      facebookToken : '',
      geolocation: {
        latitude: 0,
        longitude: 0
      },
      settings: {
        shareLocation: false
      },
      safeTrekToken: {
        accessToken: '',
        refreshToken: ''
      },
      alarmCreated: false
    }
  }
  componentDidMount () {
    const { localStorage } = this.props
    Linking.getInitialURL().then((uri) => {
      // get SafeTrek's access and refresh token from store
      localStorage.getSafeTrekToken()
      .then((safeTrekToken) => {
        if (safeTrekToken) {
          const now = Date.now()
          const tokenCreatedAt = safeTrekToken.createdAt
          const hourInMills = 3600000
          const diffInMills = Math.abs(now - tokenCreatedAt)
          const diffInHours = diffInMills / hourInMills
          // console.log('Difference: ', diffInMills)
          // console.log('Difference in Hours: ', diffInMills / hourInMills)
          // Token expires after 10 hours

          if (diffInHours >= 10) {

            // access token has expired
            // get new token and update in store
            this.updateSafeTrekToken(safeTrekToken.refreshToken)
              // get settings from store
              localStorage.getFacebookToken().then(facebookToken => {
              if (facebookToken) {
                this.setState({facebookToken: facebookToken.accessToken})
              }
              else {
                // obtain user permission to use facebook
                LoginManager.logInWithPublishPermissions(['publish_actions'])
                .then((result) => {
                  if (result.isCancelled) {
                    alert('This app needs facebook permission')
                  }
                  else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        alert(data.accessToken.toString())
                        localStorage.setFacebookToken({ accessToken : data.accessToken.toString()})
                        .then(() => {
                          this.setState({facebookToken: data.accessToken.toString()})
                        })
                      })

                  }
                }, error => console.log(error))
              }
            })
            localStorage.getSettings()
              .then((savedSettings) => {
                if (savedSettings) {
                  this.setState({settings: savedSettings})
                }

            })
          } else {
            this.setState({safeTrekToken: safeTrekToken})
            // get Settings from store
            localStorage.getFacebookToken().then(facebookToken => {
              if (facebookToken) {
                this.setState({facebookToken: facebookToken.accessToken})
              }
              else {
                // obtain user permission to use facebook
                LoginManager.logInWithPublishPermissions(['publish_actions'])
                .then((result) => {
                  if (result.isCancelled) {
                    alert('This app needs facebook permission')
                  }
                  else {
                    AccessToken.getCurrentAccessToken().then(
                      (data) => {
                        localStorage.setFacebookToken({ accessToken : data.accessToken.toString()})
                        .then(() => {
                          this.setState({facebookToken: data.accessToken.toString()})
                        })
                      })

                  }
                }, error => console.log(error))
              }
            })
            localStorage.getSettings()
            .then((savedSettings) => {
              if (savedSettings) {
                this.setState({settings: savedSettings})
              }
            })
          }
        } else {
          if (uri) {
            const authCode = uri.substring(uri.indexOf('=') + 1, uri.indexOf('&'))
            const postData = {
              'grant_type': 'authorization_code',
              'code': authCode,
              'client_id': SafeTrekClientId,
              'client_secret': SafeTrekClientSecret,
              'redirect_uri': 'safetrekfb://callback'
            }
            axios.post('https://login-sandbox.safetrek.io/oauth/token', postData)
            .then(response => {
              const responseData = response.data
              // Token Type is bearer
              const accessToken = responseData.access_token
              const refreshToken = responseData.refresh_token
              const createdAt = Date.now()
              // set Token in store and set token in state
              localStorage.setSafeTrekToken({accessToken, refreshToken, createdAt} )
              .then(() => {
                this.setState({
                  safeTrekToken: {
                    accessToken: accessToken,
                    refreshToken: refreshToken
                  }
                })
              })
              localStorage.getFacebookToken().then(facebookToken => {
                if (facebookToken) {
                  this.setState({facebookToken: facebookToken.accessToken})
                }
                else {
                  // obtain user permission to use facebook
                  LoginManager.logInWithPublishPermissions(['publish_actions'])
                  .then((result) => {
                    if (result.isCancelled) {
                      alert('This app needs facebook permission')
                    }
                    else {
                      AccessToken.getCurrentAccessToken().then(
                        (data) => {
                          localStorage.setFacebookToken({ accessToken : data.accessToken.toString()})
                          .then(() => {
                            this.setState({facebookToken: data.accessToken.toString()})
                          })
                        })

                    }
                  }, error => console.log(error))
                }
              })

            })
            .catch(error => console.log('Error retrieving accessToken: ', error))

          } else if (this.state.safeTrekToken.accessToken.length <= 0) {
            // if not SafeTrek token is stored redirect user to authorize app
            let url = 'https://account-sandbox.safetrek.io/authorize?' +
            `audience=https://api-sandbox.safetrek.io&client_id=${SafeTrekClientId}` +
            '&scope=openid+phone+offline_access&response_type=code&redirect_uri=safetrekfb://callback'
            Linking.openURL(url).catch(err => console.error('An error occurred', err))
          }
        }
      })
      . catch (error => console.log(error))
        }). catch (error => console.log('Error occured: ' + error))

  }
  updateSafeTrekToken = (refreshToken): void => {
    const { localStorage } = this.props
    // console.log('using RefreshToken: ' , refreshToken)
    const data = {
      'grant_type': 'refresh_token',
      'client_id': SafeTrekClientId,
      'client_secret': SafeTrekClientSecret,
      'refresh_token': refreshToken
    }
    // console.log('data: ', data)
    axios.post('https://login-sandbox.safetrek.io/oauth/token', data)
    .then((response) => {
      const responseData = response.data
      const accessToken = responseData.access_token
      const createdAt = Date.now()
      localStorage.setSafeTrekToken({
        accessToken: accessToken,
        refreshToken: refreshToken,
        createdAt: createdAt
      })
      .then(() => {
        this.setState({
          safeTrekToken: {
            accessToken: accessToken,
            refreshToken: refreshToken
          }
        })
        localStorage.getSafeTrekToken()
      .then(token => console.log(token.createdAt))
      })
      .catch(error => console.log('Error retrieving new Token: ', error.message))

    })
    .catch(error => console.log(error.message))
  }
  updateFacebookToken = (token: string): void => {
    this.setState({facebookToken: token})
  }
  triggerAlarm = (): void => {
    // double check that the app was authorized
    if (this.state.safeTrekToken.accessToken.length <= 0) {
      alert('Please make sure to authorize Safe Treks service for the App.\n Close the app and try again!')
   } else {
    navigator.geolocation.getCurrentPosition(
      (position) => {
      this.setState({
        geolocation: {latitude: position.coords.latitude, longitude: position.coords.longitude}
      })
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.state.safeTrekToken.accessToken}`
        }
      }
      const data = {
        'services': {
              'police': true,
              'fire': false,
              'medical': false
            },
            'location.coordinates': {
              'lat': this.state.geolocation.latitude,
              'lng': this.state.geolocation.longitude,
              'accuracy': 10
            }
      }
      // send alarm
      axios.post('https://api-sandbox.safetrek.io/v1/alarms', data, config)
      .then(() => {
        if (this.state.settings.shareLocation) {
          this.shareAlarm(this.state.geolocation)
        } else {
          this.shareAlarm()
        }
        this.setState({alarmCreated: true})
        setTimeout(() => { this.setState({alarmCreated: false})}, 10000)
        })
      .catch(error => {
          alert('There was a problem with sending the Alarm.\n' + error.message)
        })
      },
      (error) => alert('error: ' + error.message),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
      )
   }

  }
  shareAlarm = (geolocation: Geolocation = undefined): void => {
    if (geolocation) {
      // reverse geocoding to get the address of the coordinates
      axios.get(`
      https://maps.googleapis.com/maps/api/geocode/json?latlng=${geolocation.latitude},${geolocation.longitude}&key=${GoogleApiKey}`)
      .then((response) => {
        const data = response.data
        const results = data.results
        const address = results[0].formatted_address
        // prepare post
        const shareLinkContent = {
          contentType: 'link',
          contentUrl: `http://www.google.com/maps/place/${geolocation.latitude},${geolocation.longitude}`,
          contentDescription: `Alarm send via Safe Trek App!`
        }
        // share post
        ShareApi.canShare(shareLinkContent).then(
          (canShare) => {
            if (canShare) {
              return ShareApi.share(shareLinkContent, '/me', `I triggered an Alarm via SafeTrek\n I am at ${address}`)
            }
          }
        ).then(
          () => {
            console.log('Success')
          },
         (error) => {
            console.log('error: ' + error)
          }
        )
      })
      .catch(e => alert(e))

    } else {
    const shareLinkContent = {
        contentType: 'link',
        contentUrl: `https://www.safetrekapp.com/`,
        contentDescription: `Alarm and Location send via Safe Trek App!`
      }
      ShareApi.canShare(shareLinkContent).then(
        (canShare) => {
          if (canShare) {
            return ShareApi.share(shareLinkContent, '/me', `I triggered an Alarm via SafeTrek`)
          }
        }
      ).then(
        () => {
          console.log('Success')
        },
       (error) => {
          console.log('error: ' + error)
        }
      )
    }

}
  updateLocationSharing = (): void => {
    this.setState({settings: {shareLocation: !this.state.settings.shareLocation}}, () => {
      this.props.localStorage.updateSettings(this.state.settings).then(() => {
        this.props.localStorage.getSettings()
        .then((savedSettings) => {
          if (savedSettings) {
            this.setState({settings: savedSettings})
          }
        })
        .catch(e => alert(e))
       })
    })
  }
  render() {
    return (
      <StyledView>
        <Image source={logo} style={{width: 260 , height: 55, marginBottom: 30}}/>
          <AlarmButton
            alarmCreated={this.state.alarmCreated}
            onAlarmTriggered={this.triggerAlarm}
             />

        <SettingsControls
          shareLocation={this.state.settings.shareLocation}
          onChange={this.updateLocationSharing}/>
      </StyledView>
    )
  }
}
