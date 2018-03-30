import React, {Component} from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import {
    View,
    TouchableHighlight,
    StyleSheet
} from 'react-native'

const styles = StyleSheet.create({

    button: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
        backgroundColor: '#18168c',
        height: 80,
        width: 80
    }
})
interface Props {
    alarmCreated: boolean,
    onAlarmTriggered(): void
}
class AlarmButton extends Component<Props> {

    render() {
        return(
            <View>
                <TouchableHighlight
                    style={styles.button}
                    onPress={this.props.onAlarmTriggered}
                    underlayColor='#628efc'
                    >
                    <View>
                        <Icon name='circle' size={20} color={this.props.alarmCreated ? '#FFF' : '#18168c'} / >
                    </View>
                </TouchableHighlight>
            </View>
        )
    }
}
export default AlarmButton