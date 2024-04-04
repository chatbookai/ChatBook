// ** React Imports
import { ReactElement } from 'react'

// ** MUI Imports
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Icon Imports
import Icon from 'src/@core/components/icon'

// ** Types
import { ThemeColor } from 'src/@core/layouts/types'

// ** Custom Components Imports
import OptionsMenu from 'src/@core/components/option-menu'
import CustomAvatar from 'src/@core/components/mui/avatar'



import React from 'react';
import { NodeProps } from 'reactflow';
import NodeCard from '../components/render/NodeCard';
import { FlowModuleItemType } from 'src/functions/core/module/type.d';
import Container from '../components/modules/Container';

import RenderOutput from '../components/render/RenderOutput';

const QuestionInputNode = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const { moduleId, outputs } = data;

  return (
    <Card sx={{ border: theme => `1px solid ${theme.palette.divider}` }}>
        <CardHeader
          title='Transactions'
          subheader={
            <Typography variant='body2'>
              <Box component='span' sx={{ fontWeight: 600, color: 'text.primary' }}>
                Total 48.5% growth
              </Box>{' '}
              😎 this month
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
            <Box px={4} py={'10px'} position={'relative'} borderTop={'2px solid'}>
              <RenderOutput moduleId={moduleId} flowOutputList={outputs} />
            </Box>
          </Grid>
        </CardContent>
      </Card>
  );
};


export default React.memo(QuestionInputNode);
