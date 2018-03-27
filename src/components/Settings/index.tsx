import React, {StatelessComponent} from 'react'
import Option from './Option'
import StyledContainer from './StyledContainer'
interface SettingsProps {
    shareLocation: boolean,
    onChange (): void,
    alarmCreated: boolean
}
const Settings: StatelessComponent<SettingsProps> = (props) => {
    const {shareLocation, onChange, alarmCreated} = props
    return(
        <StyledContainer>
          <Option label='Share my location on Facebook' value={shareLocation} onValueChange={onChange} alarmCreated={alarmCreated}/>
        </StyledContainer>
        )

}
export default Settings