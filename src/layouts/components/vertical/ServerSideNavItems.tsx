// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'

// ** Type Import
import { VerticalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<VerticalNavItemsType>([])
  const auth = useAuth()

  useEffect(() => {
    if(auth && auth.user && auth.user.token) {
      axios.get('/api/menu/vertical', { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json' }, params: { } }).then(response => {
        const menuArray = response.data

        setMenuItems(menuArray)
      })
    }
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
