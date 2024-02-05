
export default {
  productName: 'ChatBook',
  backEndApiChatBook: 'http://localhost:1988', // https://chatbookai.net
  meEndpoint: '/auth/me',
  storageTokenKeyName: 'ChatBookAccessToken',
  userInfoTokenKeyName: 'ChatBookUserToken',
  onTokenExpiration: 'ChatBookRefreshToken'
}

