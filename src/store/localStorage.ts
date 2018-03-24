import {AsyncStorage} from 'react-native'
import Settings from '../models/Settings'
// import Auth from '../models/Auth'
export class LocalStorage {
    async getSettings(): Promise<Settings> {
        return AsyncStorage.getItem('@MySettings')
        .then((json) => {
            return JSON.parse(json) as Settings
        })
    }
    async updateSettings(newSettings: Settings): Promise<void> {
        return AsyncStorage.setItem(`@MySettings`, JSON.stringify(newSettings))
    }
}
const localStorage = new LocalStorage
export default localStorage