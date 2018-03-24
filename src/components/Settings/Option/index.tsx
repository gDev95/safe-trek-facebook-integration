import React, {StatelessComponent} from 'react'
import {Switch} from 'react-native'
import StyledLabel from './StyledLabel'
import StyledContainer from '../StyledContainer'
interface OptionProps {
    label: string
    value: boolean,
    onValueChange (): void
}

const Option: StatelessComponent<OptionProps> = props => {
    const {label, value, onValueChange} = props
    return(
        <StyledContainer>
            <StyledLabel>{label}</StyledLabel>
            <Switch value={value} onValueChange={onValueChange}/>
        </StyledContainer>
    )

}
export default Option