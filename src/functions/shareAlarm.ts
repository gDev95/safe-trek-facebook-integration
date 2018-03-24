import { ShareApi } from 'react-native-fbsdk'
import axios from 'axios'
import GoogleApiKey from '../../secrets.js'
const shareAlarm = (geolocation: { lat: number, long: number} = undefined): void => {
    if (geolocation) {
      axios.get(`
      https://maps.googleapis.com/maps/api/geocode/json?latlng=${geolocation.lat},${geolocation.long}&key=${GoogleApiKey}`)
      .then((response) => {
        const data = response.data
        const results = data.results
        const address = results[0].formatted_address
        alert(geolocation.lat)
        const shareLinkContent = {
          contentType: 'link',
          contentUrl: `http://www.google.com/maps/place/${geolocation.lat},${geolocation.long}`,
          contentDescription: `Alarm and Location send via Safe Trek App!`
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