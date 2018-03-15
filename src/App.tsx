/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Button
} from 'react-native'

// const instructions = Platform.select({
//   ios: 'Press Cmd+R to reload,\n' +
//     'Cmd+D or shake for dev menu',
//   android: 'Double tap R on your keyboard to reload,\n' +
//     'Shake or press menu button for dev menu'
// })
const styles: any = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#3F51B5'
  },
  welcome: {
    textAlign: 'center',
    color: '#FFF',
    marginBottom: 5
  }
})

interface Props {
}
interface State {
  messageEnabled: boolean,
}
export default class App extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { messageEnabled : false }
  }
  displayMessage = () => {
    this.setState({messageEnabled: !this.state.messageEnabled})
  }
  render() {

    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>
          Welcome to React (with Typescript)!
        </Text>
        <Button onPress={this.displayMessage} title='Login'/>
        <Text style={styles.welcome}>{this.state.messageEnabled ? 'Hey' : ''}</Text>
      </View>
    )
  }
}
