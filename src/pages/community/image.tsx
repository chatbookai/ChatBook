// ** React Imports
import { Fragment, useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

import ImagesList from 'src/views/community/ImagesList'

// ** Third Party Import
import { useTranslation } from 'react-i18next'

import { ChatChatNameList, CheckPermission  } from 'src/functions/ChatBook'

// ** Axios Imports
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useAuth } from 'src/hooks/useAuth'
import { useRouter } from 'next/router'
import toast from 'react-hot-toast'

const AppChat = () => {

  // ** Hook
  const { t } = useTranslation()
  const auth = useAuth()
  const router = useRouter()
  
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(1)

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  const [pageid, setPageid] = useState<number>(0)
  const [loadingAllData, setLoadingAllData] = useState<boolean>(false)
  const [imageList, setImageList] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [loadingText, setLoadingText] = useState<string>('Loading')

  useEffect(() => {
    getImagesList()
  }, [refreshChatCounter])

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

  const { skin } = settings

  return (
    <Fragment>
      <Fragment>
        {auth.user && auth.user.email ?
          <ImagesList imageList={imageList} loading={loading} loadingText={loadingText} />
        :
        null
        }
      </Fragment>
      
    </Fragment>
  )
}


export default AppChat
