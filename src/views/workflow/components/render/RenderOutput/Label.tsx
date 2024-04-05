import { EditNodeFieldType, FlowNodeOutputItemType } from 'src/functions/core/module/node/type';
import React, { useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box, Flex } from '@chakra-ui/react';
import MyIcon from 'src/functions/web/components/common/Icon';
import { onChangeNode } from '../../../FlowProvider';
import MyTooltip from 'src/components/MyTooltip';
import { QuestionOutlineIcon } from '@chakra-ui/icons';
import SourceHandle from '../SourceHandle';
import { FlowNodeOutputTypeEnum } from 'src/functions/core/module/node/constant';
import dynamic from 'next/dynamic';

const FieldEditModal = dynamic(() => import('../FieldEditModal'));

const OutputLabel = ({
  moduleId,
  outputKey,
  outputs,
  ...item
}: FlowNodeOutputItemType & {
  outputKey: string;
  moduleId: string;
  outputs: FlowNodeOutputItemType[];
}) => {
  const { t } = useTranslation();
  const { label = '', description, edit } = item;
  const [editField, setEditField] = useState<EditNodeFieldType>();

  return (
    <Flex
      className="nodrag"
      cursor={'default'}
      justifyContent={'right'}
      alignItems={'center'}
      position={'relative'}
    >
      {description && (
        <MyTooltip label={t(description)} forceShow>
          <QuestionOutlineIcon display={['none', 'inline']} mr={1} />
        </MyTooltip>
      )}
      <Box position={'relative'}>
        {item.required && (
          <Box
            position={'absolute'}
            top={'-2px'}
            left={'-5px'}
            color={'red.500'}
            fontWeight={'bold'}
          >
            *
          </Box>
        )}
        {t(label)}
      </Box>

      {item.type === FlowNodeOutputTypeEnum.source && (
        <SourceHandle handleKey={outputKey} valueType={item.valueType} />
      )}

      {!!editField && (
        <FieldEditModal
          editField={item.editField}
          defaultField={editField}
          keys={[outputKey]}
          onClose={() => setEditField(undefined)}
          onSubmit={({ data, changeKey }) => {
            if (!data.outputType || !data.key) return;

            const newOutput: FlowNodeOutputItemType = {
              ...item,
              type: data.outputType,
              valueType: data.valueType,
              key: data.key,
              label: data.label,
              description: data.description,
              required: data.required,
              defaultValue: data.defaultValue
            };

            if (changeKey) {
              onChangeNode({
                moduleId,
                type: 'replaceOutput',
                key: editField.key,
                value: newOutput
              });
            } else {
              onChangeNode({
                moduleId,
                type: 'updateOutput',
                key: newOutput.key,
                value: newOutput
              });
            }

            setEditField(undefined);
          }}
        />
      )}
    </Flex>
  );
};

export default React.memo(OutputLabel);
