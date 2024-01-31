// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])
  const auth = useAuth()
  const router = useRouter()

  useEffect(() => {
    if(auth && auth.user && auth.user.token) {
      axios.get('/api/menu/vertical', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(response => {
        const menuArray = response.data
        if(menuArray && menuArray.status == 'error') {
          router.push('/login')
        }
        else {
          setMenuItems(menuArray)
        }

      })
    }
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
