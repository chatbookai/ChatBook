import os from 'os'

const hostname = os.hostname();

console.log('Hostname:', hostname);

export default {
  productName: 'ChatBook',
  backEndApiChatBook: (hostname == 'localhost') ? 'http://localhost:1988' : 'https://chatbookai.net',
  meEndpoint: '/auth/me',
  storageTokenKeyName: 'ChatBookAccessToken',
  userInfoTokenKeyName: 'ChatBookUserToken',
  onTokenExpiration: 'ChatBookRefreshToken',
  logo: '/images/chives.png'
}

