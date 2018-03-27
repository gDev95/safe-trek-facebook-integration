import React, {StatelessComponent} from 'react'
import Option from './Option'
import StyledContainer from './StyledContainer'
interface SettingsProps {
    shareLocation: boolean,
    onChange (): void
}
const Settings: StatelessComponent<SettingsProps> = (props) => {
    const {shareLocation, onChange} = props
    return(
        <StyledContainer>
          <Option label='Share my location on Facebook' value={shareLocation} onValueChange={onChange} />
        </StyledContainer>
        )

}
export default Settings