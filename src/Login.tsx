import React, {Component} from 'react'
import {
    LoginButton,
    AccessToken
} from 'react-native-fbsdk'
import {
    View
} from 'react-native'

interface Props {
    accessToken: string,
    onTokenUpdate(token: string): void
}
class Login extends Component<Props> {
    componentDidMount() {
      AccessToken.getCurrentAccessToken()
      .then(
        (data) => {
          this.props.onTokenUpdate(data)
        })
        .catch(() => alert('You must be logged in before you can use this app'))
    }
    render () {
        return(
      <View >
         <LoginButton
        publishPermissions={['publish_actions']}
        onLoginFinished={
          (error, result) => {
            if (error) {
              alert('login has error: ' + result.error)
            } else if (result.isCancelled) {
              alert('login is cancelled.')
            } else {
              AccessToken.getCurrentAccessToken().then(
                (data) => {
                  alert(data.accessToken.toString())
                  this.props.onTokenUpdate(data)
                }
              )
            }
          }
        }
        onLogoutFinished={() => alert('logout.')}/>

      </View >
        )
    }
}
export default Login