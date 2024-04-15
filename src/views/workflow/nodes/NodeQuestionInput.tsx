// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import Avatar from '@mui/material/Avatar'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

import { useTranslation } from 'react-i18next'
import toast from 'react-hot-toast'

import React from 'react';
import { NodeProps, Handle, Position } from 'reactflow';
import { FlowModuleItemType } from 'src/functions/workflow/type';

const QuestionInputNode = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs } = data;
  const { t } = useTranslation()

  console.log("moduleId", moduleId)
  console.log("outputs", outputs)
  console.log("data", data)

  return (
    <Card sx={{ border: theme => `1px solid ${theme.palette.divider}`, width: '500px' }}>
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
        <CardContent sx={{ pt: theme => `${theme.spacing(3)} !important` }}>
          <Grid container spacing={[5, 0]}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                px: 4,
                py: '10px',
                position: 'relative',
                borderTop: '2px solid',
                width: '100%',
              }}
            >
              {t(data.name) as string}
              <Box position={'absolute'} top={'50%'} right={'-13px'}>
                <Handle
                  style={{
                    width: '14px',
                    height: '14px',
                    borderWidth: '3.5px',
                    backgroundColor: 'main.primary',
                  }}
                  type="source"
                  id={moduleId}
                  position={Position.Right}
                />
              </Box>
            </Box>
          </Grid>
        </CardContent>
      </Card>
  );
};


export default React.memo(QuestionInputNode);
