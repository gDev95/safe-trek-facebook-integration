import {AsyncStorage} from 'react-native'
import Settings from '../models/Settings'
import {SafeTrekToken} from '../models/Rest'
// import Auth from '../models/Auth'
export class LocalStorage {
    async getToken(key: string): Promise <SafeTrekToken> {
        return AsyncStorage.getItem(`@${key}`)
        .then((json) => {
            return JSON.parse(json) as SafeTrekToken
        })
    }
    async setToken(newToken: SafeTrekToken, key: string): Promise<void> {
        return AsyncStorage.setItem(`@${key}`, JSON.stringify(newToken))
    }
    async removeToken(key: string): Promise<void> {
        return AsyncStorage.removeItem(key)
    }
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