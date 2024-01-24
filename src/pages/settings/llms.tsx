// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import LLMSLeft from 'src/views/form/LLMSLeft'

import SettingLLMSOpenAI from 'src/views/form/SettingLLMSOpenAI';

import { GetAllLLMS } from 'src/configs/functions'

const SettingApiModelAPP = () => {

  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [llms, setLlms] = useState<any>(null)
  const [llmsId, setLlmsId] = useState<number>(1)
  const [llmsName, setLlmsName] = useState<string>("")
  const userId = 1

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  const AllLLMS: any[] = GetAllLLMS()
  
  const fetchData = function () {
    setLlms(AllLLMS)
    //if(RS && RS['data'] && RS['data'][0] && RS['data'][0].id) {
      //setLlmsId(RS['data'][0].id)
      //setLlmsName(RS['data'][0].name)
    //}
  }

  const setActiveId = function (Id: number, Name: string) {
    setLlmsId(Id)
    setLlmsName(Name)
    setRefreshChatCounter(0)
  }

  useEffect(() => {
    fetchData()  
  }, [refreshChatCounter, userId])

  // ** Vars
  const { skin } = settings

  return (
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
      <LLMSLeft
        llms={llms}
        setActiveId={setActiveId}
        hidden={false}
      />
      <SettingLLMSOpenAI llmsId={llmsId} llmsName={llmsName} userId={userId}/>
    </Box>
  )
}

export default SettingApiModelAPP
