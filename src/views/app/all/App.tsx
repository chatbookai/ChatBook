// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import AppModel from 'src/views/app/all/AppModel'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'
import { CheckPermission } from 'src/functions/ChatBook'

const AllApp = () => {

  // ** Hook
  const auth = useAuth()
  const { t } = useTranslation()
  const router = useRouter()

  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])
  
  const [pageid, setPageid] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [app, setApp] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')
  const [appId, setAppId] = useState<string>('')
  
  const [type, setType] = useState<string>("ALL")
  const [search, setSearch] = useState<string>("ALL")

  useEffect(() => {
    if(auth && auth.user && auth.user.email) {
      getAppsPage(type, search)
    }
  }, [type, search, auth])

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setApp([])
    setType("ALL")
    setSearch(Item)
    setAppId("")
  }

  const getAppsPage = async function (type: string, search: string) {
    console.log("loadingAllData", loadingAllData)
    const pagesize = 20
    if(loadingAllData == false)  {
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getapppage/' + pageid + '/' + pagesize, {type, search},  {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      if(RS && RS.data) {
        const appInitial: string[] = []
        RS.data.map((Item: any)=>{
          appInitial.push(Item)
        })
        if(RS.data.length < pagesize && pageid >= 0) {
          setLoadingAllData(true)
        }
        setApp([...app, ...appInitial].filter((element) => element != null))
        setAppId("")
      }
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);  

      return () => {
        clearTimeout(timer);
      };
    }
    else {
      setLoading(true)
      setLoadingText('Finished')
      const timer2 = setTimeout(() => {
        setLoading(false);
      }, 500);

      return () => {
        clearTimeout(timer2);
      };
    }
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
      setPageid(pageid + 1)
      getAppsPage(type, search);
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [app]); 

  return (
    <Fragment>
      <AppModel app={app} loading={loading} loadingText={loadingText} appId={appId} setAppId={setAppId} show={show} setShow={setShow} handleSearchFilter={handleSearchFilter}/>
    </Fragment>
  )
}


export default AllApp
