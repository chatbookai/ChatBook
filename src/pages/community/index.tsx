// ** React Imports
import { Fragment, useEffect, useState } from 'react'

import ImagesList from 'src/views/community/ImagesList'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import { CheckPermission } from 'src/functions/ChatBook'


const AppChat = () => {

  // ** Hook
  const auth = useAuth()
  const router = useRouter()
  useEffect(() => {
      CheckPermission(auth, router, false)
  }, [])
  
  const [pageid, setPageid] = useState<number>(0)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [imageList, setImageList] = useState<any[]>([])
  const [favoriteList, setFavoriteList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')

  
  useEffect(() => {
    getImagesList()
  }, [])

  const getImagesList = async function () {
    if(auth.user && auth.user.token && loadingAllData == false)  {
      const pagesize = 20
      setLoading(true)
      const RS = await axios.post(authConfig.backEndApiChatBook + '/api/getAllImages/', {pageid: pageid, pagesize: pagesize}, {
        headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json' },
      }).then(res => res.data);
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
      if(RS && RS.status && RS.status=='error') {
        console.log("RSRSRSRSRS", RS)
        CheckPermission(auth, router, true)
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
      getImagesList();
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [imageList]); 

  return (
    <Fragment>
      <Fragment>
        {auth.user && auth.user.email ?
          <ImagesList imageList={imageList} favoriteList={favoriteList} loading={loading} loadingText={loadingText} />
        :
        null
        }
      </Fragment>
      
    </Fragment>
  )
}


export default AppChat
