
export default {
  productName: 'ChatBook',
  backEndApi: 'http://localhost:1988',
  meEndpoint: '/auth/me',
  loginEndpoint: '/jwt/login',
  registerEndpoint: '/jwt/register',
  storageTokenKeyName: 'accessToken',
  onTokenExpiration: 'refreshToken'
}