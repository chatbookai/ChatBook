// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

const AppChat = () => {

  const router = useRouter()

  useEffect(() => {
    router.push("/store")
  }, [])

  return (
    <Fragment></Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
