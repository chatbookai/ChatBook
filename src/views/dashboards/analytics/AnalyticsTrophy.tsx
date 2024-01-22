// ** MUI Imports
import Card from '@mui/material/Card'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import { styled, useTheme } from '@mui/material/styles'

// Styled component for the triangle shaped background image
const TriangleImg = styled('img')(({ theme }) => ({
  right: 0,
  bottom: 0,
  height: 170,
  position: 'absolute',
  ...(theme.direction === 'rtl' ? { transform: 'scaleX(-1)' } : {})
}))

// Styled component for the trophy image
const TrophyImg = styled('img')({
  right: 36,
  bottom: 20,
  height: 98,
  position: 'absolute'
})

interface ChainInfoType {
  network: string
  version: number
  release: number
  height: number
  current: string
  blocks: number
  peers: number
  time: number
  miningtime: number
  weave_size: number
  denomination: number
  diff: string
}

export type propsType = {
  data: ChainInfoType
}

// ** Third Party Import
import { useTranslation } from 'react-i18next'

const AnalyticsTrophy = (props: propsType) => {
  // ** Hook
  const { t } = useTranslation()
  
  // ** Props
  const { data } = props
  console.log("data", data)

  // ** Hook
  const theme = useTheme()

  const imageSrc = theme.palette.mode === 'light' ? 'triangle-light.png' : 'triangle-dark.png'

  return (
    <Card sx={{ position: 'relative' }}>
      <CardContent>
        <Typography variant='h6'>{`${t(`Welcome to ChatBookAi!`)}`} 🥳</Typography>
        <Typography variant='body2' sx={{ letterSpacing: '0.25px' }}>
        {`${t(`Chat Book AI `)}`}
        </Typography>
        {Number(data.height) > Number(data.blocks) ? 
        <Tooltip title={`${t(`Blockchain is currently syncing data. Please wait for a few hours before trying again`)}`} placement='bottom'>
          <Typography variant='h5' sx={{ my: 4, color: 'error.main' }}>
            {`${t(`Syncing`)}`} {Math.ceil(data.blocks*100/data.height)}%
          </Typography>
        </Tooltip>
        : 
        <Typography variant='h5' sx={{ my: 4, color: 'primary.main' }}>
            {data.height}
          </Typography>
        }
        <TriangleImg alt='triangle background' src={`/images/misc/${imageSrc}`} />
        <TrophyImg alt='trophy' src='/images/misc/trophy.png' />
      </CardContent>
    </Card>
  )
}

export default AnalyticsTrophy
