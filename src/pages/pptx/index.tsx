
// ** MUI Components
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'

import { layouts } from 'src/functions/pptx/data/layouts'

import { exportPPTX } from 'src/functions/pptx/Export'

const RegisterV1 = () => {
  // ** Hook
  
  exportPPTX(layouts, false, true)

  return (
      <Box className='content-center'>
        <Card sx={{ zIndex: 1, marginX: 'auto', textAlign: 'center', mt: 3 }}>
          <CardContent sx={{ p: theme => `${theme.spacing(12, 9, 7)} !important` }}>
            
          </CardContent>
        </Card>
      </Box>
  )
}

export default RegisterV1
