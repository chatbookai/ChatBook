// ** MUI Imports
import React, { Fragment } from 'react';
import Drawer from '@mui/material/Drawer'
import { styled } from '@mui/material/styles'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Icon Imports
import Icon from 'src/@core/components/icon'
import CardContent from '@mui/material/CardContent'
import Avatar from '@mui/material/Avatar'
import { useTranslation } from 'next-i18next'

import { appTypeTemplate } from '../data/appTypeTemplate'

const Header = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(3, 4),
  justifyContent: 'space-between',
  backgroundColor: theme.palette.background.default
}))

const FlowLeft = ({ LeftOpen, setLeftOpen, handleAddNode }: any) => {
  const { t } = useTranslation();
  
  const appTypeTemplateKeys: string[] = Object.keys(appTypeTemplate)

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
        <Typography variant='h6'>{t('Base Function')}</Typography>
        <IconButton size='small' onClick={()=>{setLeftOpen(false)}} sx={{ color: 'text.primary' }}>
          <Icon icon='mdi:close' fontSize={20} />
        </IconButton>
      </Header>
      <Box>
      <CardContent>
        {appTypeTemplateKeys.map((appTypeTemplateKey: any, appTypeTemplateIndex: number) => {
            const appTypeTemplateItemList: any[] = appTypeTemplate[appTypeTemplateKey];

            return (
                <Fragment key={appTypeTemplateIndex}>
                <Typography sx={{ 
                            fontWeight: 'bold', 
                            lineHeight: 1.71,
                            letterSpacing: '0.22px',
                            fontSize: '0.875rem !important',
                            maxWidth: '200px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap' ,
                            pb: 4
                        }} >
                            {t(appTypeTemplateKey)}
                </Typography>
                {appTypeTemplateItemList.map((item: any, index: number) => {
                    
                    return (
                        <Fragment key={index}>
                            <Box sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
                                onClick={()=>{handleAddNode(item.flowType)}} >
                                <Avatar src={item.avatar || authConfig.logo} sx={{ mr: 3, width: 42, height: 42 }} />
                                <Box
                                    sx={{
                                        width: '100%',
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        pb: 4
                                    }}
                                >
                                    <Box sx={{ mr: 2, display: 'flex', mb: 0.4, flexDirection: 'column' }}>
                                        <Typography sx={{ 
                                            fontWeight: 500,
                                            lineHeight: 1.71,
                                            letterSpacing: '0.22px',
                                            fontSize: '0.875rem !important',
                                            maxWidth: '200px',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            whiteSpace: 'nowrap' 
                                        }} >
                                            {t(item.name)}
                                        </Typography>
                                        <Box
                                            sx={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                '& svg': { mr: 1, color: 'text.secondary', verticalAlign: 'middle' }
                                            }}
                                        >
                                            <Typography 
                                                variant='caption' 
                                                sx={{ 
                                                    display: '-webkit-box',
                                                    WebkitBoxOrient: 'vertical',
                                                    WebkitLineClamp: 3,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {t(item.intro)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>
                            </Box>
                        </Fragment>
                    );
                })}
                </Fragment>
            )
            
        })}
      </CardContent>

      </Box>
    </Drawer>
  )
}

export default FlowLeft
