import styled, {withProps} from '../../../theme'
import {Text} from 'react-native'
interface TextProps {
    alarmCreated: boolean
}
export default withProps<TextProps, HTMLDivElement>(styled(Text))`
color:${props => props.alarmCreated ? '#000' : '#FFF'};
`
