import MyModal from 'src/functions/web/components/common/MyModal';
import React, { Dispatch, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import { Box } from '@chakra-ui/react';
import ParentPaths from 'src/components/common/ParentPaths';
import MyBox from 'src/components/common/MyBox';

type PathItemType = {
  parentId: string;
  parentName: string;
};

const DatasetSelectContainer = ({
  isOpen,
  setParentId,
  paths,
  onClose,
  tips,
  isLoading,
  children
}: {
  isOpen: boolean;
  setParentId: Dispatch<string>;
  paths: PathItemType[];
  onClose: () => void;
  tips?: string | null;
  isLoading?: boolean;
  children: React.ReactNode;
}) => {
  const { t } = useTranslation();

  return (
    <MyModal
      iconSrc="/imgs/module/db.png"
      title={
        <Box fontWeight={'normal'}>
          <ParentPaths
            paths={paths.map((path, i) => ({
              parentId: path.parentId,
              parentName: path.parentName
            }))}
            FirstPathDom={t('core.chat.Select dataset')}
            onClick={(e) => {
              setParentId(e);
            }}
          />
          {!!tips && (
            <Box fontSize={'sm'} color={'myGray.500'} fontWeight={'normal'}>
              {tips}
            </Box>
          )}
        </Box>
      }
      isOpen={isOpen}
      onClose={onClose}
      h={'80vh'}
      w={'100%'}
      maxW={['90vw', '900px']}
      isCentered
    >
      <MyBox isLoading={isLoading} h={'100%'}>
        {children}
      </MyBox>
    </MyModal>
  );
};

export function useDatasetSelect() {
  const [parentId, setParentId] = useState<string>('');

  const paths = useMemo(() => [], []);

  return {
    parentId,
    setParentId,
    datasets: [],
    paths,
    isFetching: false
  };
}

export default DatasetSelectContainer;
