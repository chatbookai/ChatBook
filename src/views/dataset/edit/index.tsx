// ** React Imports
import { useEffect, useState, Fragment } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import LeftApp from 'src/views/dataset/edit/LeftApp'
import ConfigApp from 'src/views/dataset/edit/ConfigApp'
import ConfigAppDelete from 'src/views/dataset/edit/ConfigAppDelete'
import Collection from 'src/views/dataset/edit/Collection'

// ** Axios Imports
import toast from 'react-hot-toast'
import axios from 'axios'
import authConfig from 'src/configs/auth'
import { useRouter } from 'next/router'
import { useAuth } from 'src/hooks/useAuth'
import { CheckPermission } from 'src/functions/ChatBook'
import { useTranslation } from 'react-i18next'

const EditDataSet = (props: any) => {
  // ** States
  const [app, setApp] = useState<any>({openDelete: false})
  const [isDisabledButton, setIsDisabledButton] = useState<boolean>(false)
  const [avatarFiles, setAvatarFiles] = useState<File[]>([])

  const { menuid } = props

  // ** Hooks
  const { t } = useTranslation()
  const theme = useTheme()
  const { settings } = useSettings()
  const auth = useAuth()
  const router = useRouter()
  const { id } = router.query
  useEffect(() => {
    CheckPermission(auth, router, false)
  }, [])

  const fetchData = async function (id: string) {
    if (auth && auth.user && id) {
      const RS = await axios.get(authConfig.backEndApiChatBook + '/api/getdataset/' + id, { headers: { Authorization: auth.user.token, 'Content-Type': 'application/json'} }).then(res=>res.data)
      setApp({...RS, openDelete: false})
    }
  }

  const handleEditDataSet = async () => {
    console.log("handleEditDataSet app", app, avatarFiles)
    setIsDisabledButton(true)
    if (auth && auth.user) {
      const appNew = {
        ...app,
        updateTime: String(new Date(Date.now()).toLocaleString())
      }
      
      const formData = new FormData();
      for (const key in appNew) {
        if (appNew.hasOwnProperty(key)) {
          const value = appNew[key];
          formData.append(key, value);
        }
      }

      // Now you can append the image file(s) to the formData
      avatarFiles.forEach((file: any) => {
        formData.append(`avatar`, file);
      });

      const FormSubmit: any = await axios.post(
        authConfig.backEndApiChatBook + '/api/editdataset',
        formData,
        {
          headers: {
            Authorization: auth.user.token,
            'Content-Type': 'multipart/form-data', // Important: Use multipart/form-data for file uploads
          },
        }
      ).then(res => res.data);

      console.log("FormSubmit", FormSubmit)
      setIsDisabledButton(false)
      if(FormSubmit?.status == "ok") {
        toast.success(t(FormSubmit.msg) as string, {
          duration: 2000
        })
      }
    }
  }

  const handleDeleteDataSet = async () => {
    console.log("handleDeleteDataSet app", app)
    setIsDisabledButton(true)
    if (auth && auth.user) {
      const appNew = {
        ...app
      }
      const PostParams = appNew
      const FormSubmit: any = await axios.post(authConfig.backEndApiChatBook + '/api/deletedataset', PostParams, { headers: { Authorization: auth?.user?.token, 'Content-Type': 'application/json'} }).then(res => res.data)
      console.log("FormSubmit", FormSubmit)
      if(FormSubmit?.status == "ok") {
        toast.success(t(FormSubmit.msg) as string, {
          duration: 2000
        })
        setIsDisabledButton(false)
        router.push('/dataset/my')
      }
    }
  }

  useEffect(() => {
    if(id) {
      fetchData(String(id))  
    }
  }, [id])

  // ** Vars
  const { skin } = settings

  return (
    <Fragment>
      {auth.user && auth.user.email ?
      <Box
        className='app-chat'
        sx={{
          width: '100%',
          height: '100%',
          display: 'flex',
          borderRadius: 1,
          overflow: 'hidden',
          position: 'relative',
          backgroundColor: 'background.paper',
          boxShadow: skin === 'bordered' ? 0 : 6,
          ...(skin === 'bordered' && { border: `1px solid ${theme.palette.divider}` })
        }}
      >
        <LeftApp app={app} hidden={false} menuid={menuid}/>
        
        {menuid == 'collection' && app && app._id ?
        <Fragment>
          <Collection datasetId={app._id} />
        </Fragment>
        :
        null
        }

        {menuid == 'config' && app && app._id ?
        <Fragment>
          <ConfigApp app={app} setApp={setApp} handleEditDataSet={handleEditDataSet} avatarFiles={avatarFiles} setAvatarFiles={setAvatarFiles}/>
          <ConfigAppDelete app={app} setApp={setApp} isDisabledButton={isDisabledButton} handleDeleteDataSet={handleDeleteDataSet}/>
        </Fragment>
        :
        null
        }

        {menuid == 'searchtest' && app && app._id ?
        <Fragment>
          <ConfigApp app={app} setApp={setApp} handleEditDataSet={handleEditDataSet} avatarFiles={avatarFiles} setAvatarFiles={setAvatarFiles}/>
          <ConfigAppDelete app={app} setApp={setApp} isDisabledButton={isDisabledButton} handleDeleteDataSet={handleDeleteDataSet}/>
        </Fragment>
        :
        null
        }

      </Box>
      :
      null
      }
    </Fragment>
  )
}

export default EditDataSet

