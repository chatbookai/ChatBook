// ** React Imports
import { Fragment } from 'react'

// ** MUI Imports
import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardMedia from '@mui/material/CardMedia'
import authConfig from 'src/configs/auth'

import TransitionPage from './TransitionPage'

const ChatContent = (props: any) => {
  // ** Props
  const {
    imageList,
    pendingImagesCount
  } = props

  console.log("imageList", imageList)

  const renderContent = () => {
          return (
            <Grid container spacing={2}>
              <Grid item xs={12} sx={{ height: '100%', overflowY: 'auto', scrollbarWidth: 'thin', scrollbarColor: '#ffffff' }}>
                <Card sx={{ px: 3, pt: 1}}>
                  {true ? (
                    <Fragment>
                      <Grid container spacing={2}>
                        {Array.from({ length: pendingImagesCount }, (_, index) => index + 1).map((Index: number)=>{
                          return (
                            <Grid item key={Index} xs={12} sm={6} md={3} lg={3} sx={{mt: 2}}>
                              <TransitionPage />
                            </Grid>
                            )
                        })}
                        {imageList && imageList.map((item: any, index: number) => (
                          <Grid item key={index} xs={12} sm={6} md={3} lg={3} sx={{mt: 2}}>
                            <CardMedia image={`${authConfig.backEndApi}/api/image/${item}`} sx={{ height: '11.25rem', objectFit: 'contain', borderRadius: 1 }}/>
                          </Grid>
                        ))}
                      </Grid>
                    </Fragment>
                  ) : (
                    <Fragment></Fragment>
                  )}
                </Card>
              </Grid>
            </Grid>
          )
  }

  return renderContent()
}

export default ChatContent
