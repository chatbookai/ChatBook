// ** React Imports
import { createContext, useEffect, useState, ReactNode } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

// ** Axios
import axios from 'axios'
import toast from 'react-hot-toast'

// ** Config
import authConfig from 'src/configs/auth'

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
  register: () => Promise.resolve()
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

  const handleLogin = (params: LoginParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('/api/user/login', params)
      .then(async response => {
        if(response.data.status == 'ok') {
          params.rememberMe ? window.localStorage.setItem(authConfig.storageTokenKeyName, response.data.token) : null
          const returnUrl = router.query.returnUrl
          setUser({ ...response.data.data, token: response.data.token})
          params.rememberMe ? window.localStorage.setItem(authConfig.userInfoTokenKeyName, JSON.stringify(response.data.data)) : null
          toast.success(response.data.msg, { duration: 4000 })
          const redirectURL = returnUrl && returnUrl !== '/' ? returnUrl : '/'
          router.replace(redirectURL as string)
        }
        else {
          toast.error(response.data.msg, { duration: 4000 })
        }
      })
      .catch(err => {
        if (errorCallback) errorCallback(err)
      })
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
    }
  }, [])

  const handleLogout = () => {
    setUser({'loading': '1'} as UserDataType)
    window.localStorage.removeItem(authConfig.userInfoTokenKeyName)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    router.push('/login')
  }

  const handleRegister = (params: RegisterParams, errorCallback?: ErrCallbackType) => {
    axios
      .post('/api/user/register', params)
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
    register: handleRegister
  }

  return <AuthContext.Provider value={values}>{children}</AuthContext.Provider>
}

export { AuthContext, AuthProvider }
