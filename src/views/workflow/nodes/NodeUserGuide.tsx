// ** React Imports
import React, { ReactElement, Fragment, useTransition } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import Tooltip from '@mui/material/Tooltip'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import TextField from '@mui/material/TextField';

import { useTranslation } from 'react-i18next'
import Divider from '@mui/material/Divider'
import toast from 'react-hot-toast'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

import { NodeProps, Handle, Position } from 'reactflow';
import { FlowModuleItemType } from 'src/functions/workflow/type';

const QuestionInputNode = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs } = data;
  const { t } = useTranslation()
  const [, startTst] = useTransition();

  console.log("QuestionInputNode moduleId", moduleId)
  console.log("QuestionInputNode outputs", outputs)
  console.log("QuestionInputNode data", data)

  return (
    <Card sx={{ border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader
          title={
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={data.avatar} sx={{ mr: 2.5, width: 40, height: 40 }} />
                <Typography sx={{ fontWeight: 600, fontSize: '1.25rem' }}>{t(data.name) as string}</Typography>
              </Box>
            }
          subheader={
            <Typography variant='subtitle1'>
              {t(data.intro) as string}
            </Typography>
          }
          titleTypographyProps={{
            sx: {
              mb: 2.5,
              lineHeight: '2rem !important',
              letterSpacing: '0.15px !important'
            }
          }}
        />
        <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          
            {data && data.inputs && data.inputs.length>0 && data.inputs.map((item: any) => {

                return (<Fragment>

                        {item.key == 'welcomeText' ?
                        <Fragment>
                          <Grid container spacing={[5, 0]} sx={{pt:3}}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/modules/welcomeText.svg'} variant="rounded" sx={{ width: '32px', height: '32px'}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('welcomeTextTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                            </Box>
                            <TextField
                              multiline
                              rows={4}
                              defaultValue={item.value}
                              style={{ width: '100%', resize: 'both'}}
                              placeholder={item.value}
                              onChange={(e) => {
                                startTst(() => {
                                  //Action
                                });
                              }}
                            />
                          </Grid>
                          <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                        </Fragment>
                        :
                        null}

                        {item.key == 'variables' ?
                        <Fragment>
                          <Grid container spacing={[5, 0]} sx={{pt:3}}>
                            <Box display="flex" mb={1} alignItems="center">
                              <Avatar src={'/icons/core/modules/welcomeText.svg'} variant="rounded" sx={{ width: '32px', height: '32px'}} />
                              <Typography sx={{pl: 2}}>{t(item.label) as string}</Typography>
                              <Tooltip title={t('variableTip')}>
                                <HelpOutlineIcon sx={{ display: ['none', 'inline'], ml: 1 }} />
                              </Tooltip>
                            </Box>
                            <TextField
                              multiline
                              rows={4}
                              defaultValue={item.value}
                              style={{ width: '100%', resize: 'both'}}
                              placeholder={item.value}
                              onChange={(e) => {
                                startTst(() => {
                                  //Action
                                });
                              }}
                            />
                          </Grid>
                          <Divider sx={{ bgcolor: 'rgba(0, 0, 0, 0.12)' }} />
                        </Fragment>
                        :
                        null}

                        </Fragment>)
            })

            }
        </CardContent>
      </Card>
  );
};


export default React.memo(QuestionInputNode);
