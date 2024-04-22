// ** MUI Imports
import Drawer from '@mui/material/Drawer'
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'
import FormControl from '@mui/material/FormControl'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Custom Components Imports
import CustomChip from 'src/@core/components/mui/chip'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const FlowLeft = ({ LeftOpen, setLeftOpen }: any) => {
  return (
    <Drawer
      open={LeftOpen}
      anchor='left'
      variant='temporary'
      onClose={()=>{setLeftOpen(false)}}
      sx={{ '& .MuiDrawer-paper': { width: [300, 400] } }}
      ModalProps={{ keepMounted: true }}
    >
      <Header>
        <Typography variant='h6'>Send Invoice</Typography>
        <IconButton size='small' onClick={()=>{setLeftOpen(false)}} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box sx={{ p: 5 }}>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField type='email' label='From' variant='outlined' defaultValue='shelbyComapny@email.com' />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField type='email' label='To' variant='outlined' defaultValue='qConsolidated@email.com' />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField label='Subject' variant='outlined' defaultValue='Invoice of purchased Admin Templates' />
        </FormControl>
        <FormControl fullWidth sx={{ mb: 6 }}>
          <TextField
            rows={10}
            multiline
            label='Message'
            type='textarea'
            variant='outlined'
            defaultValue={`Dear Queen Consolidated,

Thank you for your business, always a pleasure to work with you!

We have generated a new invoice in the amount of $95.59

We would appreciate payment of this invoice by 05/11/2019`}
          />
        </FormControl>
        <Box sx={{ mb: 6 }}>
          <CustomChip
            size='small'
            skin='light'
            color='primary'
            label='Invoice Attached'
            sx={{ borderRadius: '5px' }}
            icon={<Icon icon='mdi:attachment' fontSize={20} />}
          />
        </Box>
        <div>
          <Button size='large' variant='contained' onClick={()=>{setLeftOpen(false)}} sx={{ mr: 4 }}>
            Send
          </Button>
          <Button size='large' variant='outlined' color='secondary' onClick={()=>{setLeftOpen(false)}}>
            Cancel
          </Button>
        </div>
      </Box>
    </Drawer>
  )
}

export default FlowLeft
