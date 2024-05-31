// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import AppModel from 'src/views/app/all/AppModel'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { getAnonymousUserId } from 'src/functions/ChatBook'

const AllApp = () => {

  // ** Hook
  const auth = useAuth()

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
    getAppsPage(type, search)
  }, [type, search])

  const handleSearchFilter = async function (Item: string) {
    setPageid(0)
    setLoadingAllData(false)
    setApp([])
    setType("ALL")
    setSearch(Item)
    setAppId("")
  }

  const getAppsPage = async function (type: string, search: string) {
    const pagesize = 20
    let authorization = null
    if(auth.user && auth.user.id && auth.user.email && auth.user.token)   {
      authorization = auth.user.token
    }
    else {
      authorization = getAnonymousUserId()
    }

    console.log("loadingAllData loadingAllData", loadingAllData)
    console.log("loadingAllData authorization", authorization)

    if(loadingAllData == false && authorization)  {
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getapppageall/' + pageid + '/' + pagesize, {type, search},  {
        headers: { Authorization: authorization, 'Content-Type': 'application/json' },
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
