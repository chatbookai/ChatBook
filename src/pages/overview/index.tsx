// ** React Imports
import { Fragment, useEffect } from 'react'

// ** Next Import
import { useRouter } from 'next/router'

const AppChat = () => {

  const router = useRouter()

  useEffect(() => {
    router.push("/chat/chat")
  }, [])

  return (
    <Fragment></Fragment>
  )
}

AppChat.contentHeightFixed = true

export default AppChat
