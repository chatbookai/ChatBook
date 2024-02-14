// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'
import authConfig from 'src/configs/auth'
import toast from 'react-hot-toast'

// ** Config
import { useTranslation } from 'react-i18next'

// ** Types
import { AuthValuesType, RegisterParams, LoginParams, ErrCallbackType, UserDataType } from './types'

// ** Defaults
const defaultProvider: AuthValuesType = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  register: () => Promise.resolve(),
  refresh: () => Promise.resolve()
}

const AuthContext = createContext(defaultProvider)

type Props = {
  children: ReactNode
}

const AuthProvider = ({ children }: Props) => {
  // ** States
  const [user, setUser] = useState<UserDataType | null>(defaultProvider.user)
  const [loading, setLoading] = useState<boolean>(defaultProvider.loading)

  // ** Hooks
  const router = useRouter()
  const { t } = useTranslation()

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.backEndApiChatBook + '/api/user/login', params)
      .then(async response => {
        if(response.data.status == 'ok') {
          params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token) : null
          const returnUrl = router.query.returnUrl
          setUser({ ...response.data.data, token: response.data.token})
          params.rememberMe ? window.localStorage.setItem(authConfig.userInfoTokenKeyName, JSON.stringify(response.data.data)) : null
          toast.success(t(response.data.msg) as string, { duration: 4000 })
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        }
        else {
          toast.error(t(response.data.msg) as string, { duration: 4000 })
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
  }

  const handleRefreshToken = (user: UserDataType) => {
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName)
    if(user && window && token)  {
      axios
        .post(authConfig.backEndApiChatBook + '/api/user/refreshtoken', {}, { headers: { Authorization: token, 'Content-Type': 'application/json'} })
        .then(async (response: any) => {
          if(response.data.status == 'ok' && response.data.token) {
            window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token)
            setUser({ ...user, token: response.data.token})
            
            //toast.success(t(response.data.msg) as string, { duration: 4000 })
          }
          else {
            
            //toast.error(t(response.data.msg) as string, { duration: 4000 })
          }
        })
    }
  }


  useEffect(() => {
    const userData = window.localStorage.getItem(authConfig.userInfoTokenKeyName)
    const token = window.localStorage.getItem(authConfig.storageTokenKeyName)
    if(userData) {
      const user = JSON.parse(userData)
      setUser({...user, token, 'loading': '1'} as UserDataType)
    }
    else {
      setUser({'loading': '1'} as UserDataType)
      router.push('/overview')
    }
  }, [])

  const handleLogout = () => {
    setUser({'loading': '1'} as UserDataType)
    window.localStorage.removeItem(authConfig.userInfoTokenKeyName)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/overview')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post(authConfig.backEndApiChatBook + '/api/user/register', params)
      .then(res => {
        if (res.data.status == 'ok') {
          //handleLogin({ email: params.email, password: params.password })
        }
        else {
          if (errorCallback) errorCallback(res.data.error)
        }
      })
      .catch((err: { [key: string]: string }) => (errorCallback ? errorCallback(err) : null))
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
    refresh: handleRefreshToken
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
