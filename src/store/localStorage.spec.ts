import { LocalStorage } from './localStorage'

describe('LocalStorage', () => {
    it('stores settings and retrieves settings', () => {
      const store = new LocalStorage
      store.updateSettings({ shareLocation: true }).then(() => {
          store.getSettings().then(data => expect(data.shareLocation).toEqual(true))
      })
    })
  })