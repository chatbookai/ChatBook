// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import AgentList from 'src/views/agents/AgentList'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'


const AppChat = () => {

  // ** Hook
  const auth = useAuth()
  
  const [pageid, setPageid] = useState<number>(0)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [imageList, setImageList] = useState<any[]>([])
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')

  
  useEffect(() => {
    getAgentList()
  }, [])

  const getAgentList = async function () {
    if(loadingAllData == false)  {
      const pagesize = 20
      setLoading(true)
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/agents/' + pageid + '/' + pagesize, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
      console.log("RS.data", RS.data)
      if(RS && RS.data) {
        const imageListInitial: string[] = []
        RS.data.map((Item: any)=>{
          imageListInitial.push(Item)
        })
        if(RS.data.length < pagesize) {
          setLoadingAllData(true)
        }
        setImageList([...imageList, ...imageListInitial].filter((element) => element != null))
        setFavoriteList(RS.favorite)
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
      getAgentList();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [imageList]); 

  return (
    <Fragment>
      <AgentList imageList={imageList} favoriteList={favoriteList} loading={loading} loadingText={loadingText} />
    </Fragment>
  )
}


export default AppChat
