// ** React Imports
import { SyntheticEvent, useState } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import TabContext from '@mui/lab/TabContext'
import Typography from '@mui/material/Typography'

const TabsVertical = () => {
  // ** State
  const [value, setValue] = useState<string>('1')

  const handleChange = (event: SyntheticEvent, newValue: string) => {
    setValue(newValue)
  }

  return (
    <TabContext value={value}>
      <Box sx={{ display: 'flex' }}>
        <TabList orientation='vertical' onChange={handleChange} aria-label='vertical tabs example'>
          <Tab value='1' label='Tab 1' />
          <Tab value='2' label='Tab 2' />
          <Tab value='3' label='Tab 3' />
        </TabList>
        <TabPanel value='1'>
          <Typography>
            Cake apple pie chupa chups biscuit liquorice tootsie roll liquorice sugar plum. Cotton candy wafer wafer
            jelly cake caramels brownie gummies.
          </Typography>
        </TabPanel>
        <TabPanel value='2'>
          <Typography>
            Chocolate bar carrot cake candy canes sesame snaps. Cupcake pie gummi bears jujubes candy canes. Chupa chups
            sesame snaps halvah.
          </Typography>
        </TabPanel>
        <TabPanel value='3'>
          <Typography>
            Danish tiramisu jujubes cupcake chocolate bar cake cheesecake chupa chups. Macaroon ice cream tootsie roll
            carrot cake gummi bears.
          </Typography>
        </TabPanel>
      </Box>
    </TabContext>
  )
}

export default TabsVertical
