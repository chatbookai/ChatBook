// ** React Imports
import React, { useCallback, useMemo, useTransition } from 'react';

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

import { NodeProps, Handle, Position } from 'reactflow';
import { FlowModuleItemType, ModuleItemType } from 'src/functions/workflow/type';
import TextField from '@mui/material/TextField';
import { useTheme } from '@mui/material/styles';

//#########################################################


import { QuestionOutlineIcon } from '@chakra-ui/icons';

import { ModuleInputKeyEnum } from 'src/functions/workflow/constants';
import { welcomeTextTip } from 'src/functions/workflow/template/tip';

import VariableEdit from 'src/views/workflow/components/modules/VariableEdit';
import MyIcon from 'src/functions/temp/web/components/common/Icon';
import MyTooltip from 'src/components/MyTooltip';
import type { VariableItemType } from 'src/functions/workflow/type';
import QGSwitch from 'src/components/core/module/Flow/components/modules/QGSwitch';
import TTSSelect from 'src/components/core/module/Flow/components/modules/TTSSelect';
import { splitGuideModule } from 'src/functions/temp/core/module/utils';

const NodeUserGuide = ({ data, selected }: NodeProps<FlowModuleItemType>) => {
  const theme = useTheme();
  return (
    <>
        <Grid container spacing={[5, 0]}>
          <WelcomeText data={data} />
          <Box pt={4} pb={2}>
            <ChatStartVariable data={data} />
          </Box>
          <Box pt={3}>
            <TTSGuide data={data} />
          </Box>
          <Box mt={3} pt={3}>
            <QuestionGuide data={data} />
          </Box>
        </Grid>
    </>
  );
};

export default React.memo(NodeUserGuide);

function WelcomeText({ data }: { data: FlowModuleItemType }) {
  const { t } = useTranslation();
  const { inputs, moduleId } = data;
  const [, startTst] = useTransition();

  const welcomeText = inputs.find((item) => item.key === ModuleInputKeyEnum.welcomeText);

  return (
    <>
    <Box sx={{ display: 'flex' }} mb={1} alignItems={'center'}>
        <MyIcon name={'core/modules/welcomeText'} mr={2} w={'16px'} color={'#E74694'} />
        <Box>{t('core.app.Welcome Text')}</Box>
        <MyTooltip label={t(welcomeTextTip)} forceShow>
          <QuestionOutlineIcon display={['none', 'inline']} ml={1} />
        </MyTooltip>
    </Box>
      {welcomeText && (
        <TextField
          multiline
          className="nodrag"
          rows={6}
          resize={'both'}
          defaultValue={welcomeText.value}
          bg={'myWhite.500'}
          placeholder={t(welcomeTextTip)}
          onChange={(e) => {
            startTst(() => {
              onChangeNode({
                moduleId,
                key: ModuleInputKeyEnum.welcomeText,
                type: 'updateInput',
                value: {
                  ...welcomeText,
                  value: e.target.value
                }
              });
            });
          }}
        />
      )}
    </>
  );
}

function ChatStartVariable({ data }: { data: FlowModuleItemType }) {
  const { inputs, moduleId } = data;

  const variables = useMemo(
    () =>
      (inputs.find((item) => item.key === ModuleInputKeyEnum.variables)
        ?.value as VariableItemType[]) || [],
    [inputs]
  );

  const updateVariables = useCallback(
    (value: VariableItemType[]) => {
      onChangeNode({
        moduleId,
        key: ModuleInputKeyEnum.variables,
        type: 'updateInput',
        value: {
          ...inputs.find((item) => item.key === ModuleInputKeyEnum.variables),
          value
        }
      });
    },
    [inputs, moduleId]
  );

  return <VariableEdit variables={variables} onChange={(e) => updateVariables(e)} />;
}

function QuestionGuide({ data }: { data: FlowModuleItemType }) {
  const { inputs, moduleId } = data;

  const questionGuide = useMemo(
    () =>
      (inputs.find((item) => item.key === ModuleInputKeyEnum.questionGuide)?.value as boolean) ||
      false,
    [inputs]
  );

  return (
    <QGSwitch
      isChecked={questionGuide}
      size={'lg'}
      onChange={(e) => {
        const value = e.target.checked;
        onChangeNode({
          moduleId,
          key: ModuleInputKeyEnum.questionGuide,
          type: 'updateInput',
          value: {
            ...inputs.find((item) => item.key === ModuleInputKeyEnum.questionGuide),
            value
          }
        });
      }}
    />
  );
}

function TTSGuide({ data }: { data: FlowModuleItemType }) {
  const { inputs, moduleId } = data;
  const { ttsConfig } = splitGuideModule({ inputs } as ModuleItemType);

  return (
    <TTSSelect
      value={ttsConfig}
      onChange={(e) => {
        onChangeNode({
          moduleId,
          key: ModuleInputKeyEnum.tts,
          type: 'updateInput',
          value: {
            ...inputs.find((item) => item.key === ModuleInputKeyEnum.tts),
            value: e
          }
        });
      }}
    />
  );
}
