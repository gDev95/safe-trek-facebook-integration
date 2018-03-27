import { ShareApi } from 'react-native-fbsdk'
import axios from 'axios'
import Geolocation from '../models/Geolocation'
import { GoogleApiKey } from '../../secrets.js'
const shareAlarm = (geolocation: Geolocation = undefined): void => {
    if (geolocation) {
      axios.get(`
      https://maps.googleapis.com/maps/api/geocode/json?latlng=${geolocation.latitude},${geolocation.longitude}&key=${GoogleApiKey}`)
      .then((response) => {
        const data = response.data
        const results = data.results
        const address = results[0].formatted_address
        alert(geolocation.latitude)
        const shareLinkContent = {
          contentType: 'link',
          contentUrl: `http://www.google.com/maps/place/${geolocation.latitude},${geolocation.longitude}`,
          contentDescription: `Alarm send via Safe Trek App!`
        }
        ShareApi.canShare(shareLinkContent).then(
          (canShare) => {
            if (canShare) {
              return ShareApi.share(shareLinkContent, '/me', `I triggered an Alarm via SafeTrek\n I am at ${address}`)
            }
          }
        ).then(
          () => {
            alert('Share with ShareApi success.')
          },
         (error) => {
            alert('Share with ShareApi failed with error: ' + error)
          }
        )
      })
      .catch(e => alert(e))

    } else {
    const shareLinkContent = {
        contentType: 'link',
        contentUrl: `www.safetrek.com`,
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
          alert('Share with ShareApi success.')
        },
       (error) => {
          alert('Share with ShareApi failed with error: ' + error)
        }
      )
    }

}
export default shareAlarm