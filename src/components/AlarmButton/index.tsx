import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    View,
    TouchableHighlight,
    StyleSheet
} from 'react-native'

const helpIcon = (<Icon name='bell' size={30} color='#FFF' />)
const styles = StyleSheet.create({

    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        backgroundColor: '#1d2749',
        height: 80,
        width: 80
    }
})
interface Props {
    onAlarmTriggered(): void
}
class AlarmButton extends Component<Props> {

    render() {
        return(
            <View>
                <TouchableHighlight style={styles.button} onPress={this.props.onAlarmTriggered}>
                    <View style={styles.button}>
                        {helpIcon}
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}
export default AlarmButton