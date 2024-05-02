import TextField from '@mui/material/TextField'
import { styled } from '@mui/material/styles'

const CustomTextField = styled(TextField)({
    '& textarea': {
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(155, 155, 155, 0.5) rgba(255, 255, 255, 0.2)',
      '&::-webkit-scrollbar': {
        width: '8px',
      },
      '&::-webkit-scrollbar-track': {
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      },
      '&::-webkit-scrollbar-thumb': {
        backgroundColor: 'rgba(155, 155, 155, 0.5)',
        borderRadius: '8px',
      },
      '&::-webkit-scrollbar-thumb:hover': {
        backgroundColor: 'rgba(155, 155, 155, 0.8)',
      },
    },
  });

export default CustomTextField