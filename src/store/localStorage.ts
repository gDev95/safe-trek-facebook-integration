import {AsyncStorage} from 'react-native'
import Settings from '../models/Settings'
import {SafeTrekToken, Token} from '../models/Rest'
// import Auth from '../models/Auth'
export class LocalStorage {
    async getFacebookToken(): Promise<Token> {
        return AsyncStorage.getItem('@FacebookToken')
        .then((json) => {
            return JSON.parse(json) as Token
        })
    }
    async setFacebookToken(newToken: Token): Promise<void> {
        return AsyncStorage.setItem('@FacebookToken', JSON.stringify(newToken))
    }
    async getSafeTrekToken(): Promise <SafeTrekToken> {
        return AsyncStorage.getItem(`@SafeTrekToken`)
        .then((json) => {
            return JSON.parse(json) as SafeTrekToken
        })
    }

    async setSafeTrekToken(newToken: SafeTrekToken): Promise<void> {
        return AsyncStorage.setItem(`@$SafeTrekToken`, JSON.stringify(newToken))
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