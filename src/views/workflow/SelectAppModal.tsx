import React, { useMemo } from 'react';
import { ModalBody, Flex, Box, useTheme, ModalFooter, Button } from '@chakra-ui/react';
import MyModal from 'src/functions/web/components/common/MyModal';
import { useQuery } from '@tanstack/react-query';
import type { SelectAppItemType } from 'src/functions/core/module/type';
import Avatar from 'src/components/Avatar';
import { useTranslation } from 'next-i18next';
import { useLoading } from 'src/functions/web/hooks/useLoading';

const SelectAppModal = ({
  defaultApps = [],
  filterAppIds = [],
  max = 1,
  onClose,
  onSuccess
}: {
  defaultApps: string[];
  filterAppIds?: string[];
  max?: number;
  onClose: () => void;
  onSuccess: (e: SelectAppItemType[]) => void;
}) => {
  const { t } = useTranslation();
  const { Loading } = useLoading();
  const theme = useTheme();
  const [selectedApps, setSelectedApps] = React.useState<string[]>(defaultApps);

  const apps: any = {}
  
  return (
    <MyModal
      isOpen
      title={`选择应用${max > 1 ? `(${selectedApps.length}/${max})` : ''}`}
      iconSrc="/imgs/module/ai.svg"
      onClose={onClose}
      position={'relative'}
      w={'600px'}
    >
      <ModalBody
        display={'grid'}
        gridTemplateColumns={['1fr', 'repeat(3, minmax(0, 1fr))']}
        gridGap={4}
      >
        {apps.map((app) => (
          <Flex
            key={app._id}
            alignItems={'center'}
            border={theme.borders.base}
            borderRadius={'md'}
            p={2}
            cursor={'pointer'}
            {...(selectedApps.includes(app._id)
              ? {
                  bg: 'primary.100',
                  onClick: () => {
                    setSelectedApps(selectedApps.filter((e) => e !== app._id));
                  }
                }
              : {
                  onClick: () => {
                    if (max === 1) {
                      setSelectedApps([app._id]);
                    } else if (selectedApps.length < max) {
                      setSelectedApps([...selectedApps, app._id]);
                    }
                  }
                })}
          >
            <Avatar src={app.avatar} w={['16px', '22px']} />
            <Box fontWeight={'bold'} ml={1}>
              {app.name}
            </Box>
          </Flex>
        ))}
      </ModalBody>
      <ModalFooter>
        <Button variant={'whiteBase'} onClick={onClose}>
          {t('common.Close')}
        </Button>
        <Button
          ml={2}
          onClick={() => {
            onSuccess(
              apps
                .filter((app) => selectedApps.includes(app._id))
                .map((app) => ({
                  id: app._id,
                  name: app.name,
                  logo: app.avatar
                }))
            );
            onClose();
          }}
        >
          {t('common.Confirm')}
        </Button>
      </ModalFooter>
      <Loading loading={isLoading} fixed={false} />
    </MyModal>
  );
};

export default React.memo(SelectAppModal);
