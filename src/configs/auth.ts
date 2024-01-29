
export default {
  productName: 'ChatBook',
  backEndApi: 'http://localhost:1988',
  meEndpoint: '/auth/me',
  storageTokenKeyName: 'ChatBookAccessToken',
  userInfoTokenKeyName: 'ChatBookUserToken',
  onTokenExpiration: 'ChatBookRefreshToken'
}