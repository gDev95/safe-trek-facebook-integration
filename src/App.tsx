import React, {StatelessComponent} from 'react'
import { Provider } from 'mobx-react/native'
import localStorage from './store/localStorage'
import SafeTrek from './components/SafeTrek'

const App: StatelessComponent <undefined> = () => {
    return(
        <Provider localStorage={localStorage}>
            <SafeTrek/>
        </Provider>
    )
}
export default App