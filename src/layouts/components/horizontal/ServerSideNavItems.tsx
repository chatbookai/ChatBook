// ** React Imports
import { useEffect, useState } from 'react'

// ** Axios Import
import axios from 'axios'
import authConfig from 'src/configs/auth'

// ** Type Import
import { HorizontalNavItemsType } from 'src/@core/layouts/types'
import { useAuth } from 'src/hooks/useAuth'

const ServerSideNavItems = () => {
  // ** State
  const [menuItems, setMenuItems] = useState<HorizontalNavItemsType>([])
  const auth = useAuth()

  useEffect(() => {
    axios.get(authConfig.backEndApi + '/api/menu/horizontal', { headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' }, params: { } }).then(response => {
      const menuArray = response.data
      if(menuArray && menuArray.status == 'error') {
        //router.push('/overview')
      }
      else {
        setMenuItems(menuArray)
      }
    })
  }, [])

  return { menuItems }
}

export default ServerSideNavItems
