
// ** React Imports
import { useEffect, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import { useTheme } from '@mui/material/styles'

// ** Hooks
import { useSettings } from 'src/@core/hooks/useSettings'

// ** Chat App Components Imports
import KnowledgeLeft from 'src/views/form/KnowledgeLeft'

import TemplateModel from 'src/views/form/Template';

// ** Axios Imports
import axios from 'axios'

const TemplateModelAPP = () => {

  // ** States
  const [refreshChatCounter, setRefreshChatCounter] = useState<number>(0)
  const [knowledge, setKnowledge] = useState<any>(null)
  const [knowledgeId, setKnowledgeId] = useState<number>(-1)
  const [knowledgeName, setKnowledgeName] = useState<string>("")
  const userId = 1

  // ** Hooks
  const theme = useTheme()
  const { settings } = useSettings()

  const fetchData = async function () {
    const RS = await axios.get('/api/knowledge/0/100').then(res=>res.data)
    setKnowledge(RS)
    if(RS && RS['data'] && RS['data'][0] && RS['data'][0].id) {
      setKnowledgeId(RS['data'][0].id)
      setKnowledgeName(RS['data'][0].name)
    }
  }

  const setActiveId = function (Id: number, Name: string) {
    setKnowledgeId(Id)
    setKnowledgeName(Name)
    setRefreshChatCounter(0)
  }

  useEffect(() => {
    fetchData()  
  }, [refreshChatCounter])

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
      <KnowledgeLeft
        knowledge={knowledge}
        setActiveId={setActiveId}
        hidden={false}
        knowledgeId={knowledgeId}
      />
      <TemplateModel knowledgeId={knowledgeId} knowledgeName={knowledgeName} userId={userId}/>
    </Box>
  )
}

export default TemplateModelAPP
