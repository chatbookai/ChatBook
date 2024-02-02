// ** React Imports
import { useState, SyntheticEvent } from 'react'

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Box, { BoxProps } from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import TextareaAutosize from '@mui/material/TextareaAutosize'
// ** Types
import { SendMsgComponentType } from 'src/types/apps/chatTypes'

// ** Styled Components
const ChatFormWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  padding: theme.spacing(1.25, 4),
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}))

const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(0, 5, 5)
}))

const SendMsgForm = (props: SendMsgComponentType) => {
  // ** Props
  const { store, sendMsg, sendButtonDisable, sendButtonText, sendInputText} = props

  // ** State
  const [msg, setMsg] = useState<string>('')

  const handleSendMsg = (e: SyntheticEvent) => {
    e.preventDefault()
    if (store && store.selectedChat && msg.trim().length) {
      sendMsg({ ...store.selectedChat, message: msg })
    }
    setMsg('')
  }

  const maxRows = 5

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (!e.shiftKey) {
        e.preventDefault(); // 阻止默认的换行行为
        if (msg.trim().length) {
          sendMsg({ ...store.selectedChat, message: msg }); // 发送消息
          setMsg(''); // 清空文本框
        }
      } else {
        e.preventDefault(); // 阻止默认的换行行为
        // 获取当前光标位置并在此位置插入换行符
        const cursorPosition = e.target.selectionStart;
        const textBeforeCursor = msg.substring(0, cursorPosition);
        const textAfterCursor = msg.substring(cursorPosition);
        setMsg(`${textBeforeCursor}\n${textAfterCursor}`);
      }
    }
  };
  
  

  const handleChange = (e: any) => {
    const lines = e.target.value.split('\n');
    if (lines.length <= maxRows) {
      setMsg(e.target.value);
    }
  };

  return (
    <Form onSubmit={handleSendMsg}>
  <ChatFormWrapper>
    <Box sx={{ 
         position: 'relative', // 设置为相对定位
          flexGrow: 1
    }}>
      <TextareaAutosize
         minRows={2}
         maxRows={8}
         value={msg}
         placeholder={sendInputText}
         onChange={handleChange} 
         onKeyDown={handleKeyDown} 
         disabled={sendButtonDisable}
        style={{ 
          width: 'calc(100% - 100px)', // 减去按钮宽度
          marginRight: '20px', // 为按钮留出空间
          resize: 'none',
          backgroundColor: 'transparent', // 设置背景为透明
          border: 'none', // 移除边框
          padding: '0.5rem 1rem',
          fontFamily: 'inherit', // 使用默认字体
          fontWeight: '1000', // 使用默认字体粗细
          color: 'inherit', // 使用默认字体颜色
          fontSize: '1rem', // 使用默认字体大小
          outline: 'none', // 默认状态下无边框
          boxShadow: 'none', // 默认状态下无阴影
        }}
      />

      <Button type='submit' variant='contained' disabled={sendButtonDisable}  sx={{
        position: 'absolute', // 绝对定位按钮
        bottom: 5, // 距底部一定距离
        right: 10, // 距右侧一定距离
      }} endIcon={sendButtonDisable ? <CircularProgress size={20} color="inherit" /> : null}>
        {sendButtonText}
      </Button>
    </Box>
  </ChatFormWrapper>
</Form>

  )
}

export default SendMsgForm
