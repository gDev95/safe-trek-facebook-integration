import styled, {withProps} from '../../theme'
// react native components
import {View} from 'react-native'
interface ViewProps {
    alarmCreated: boolean
}
export default withProps<ViewProps, HTMLDivElement>(styled(View))`
display:flex;
flex:1;
justify-content: center;
align-items: center;
background-color:${props => props.alarmCreated ? '#FFF' : '#3F51B5'}
`