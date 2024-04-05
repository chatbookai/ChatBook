import React, { useCallback } from 'react';
import MyModal from 'src/functions/web/components/common/MyModal';
const useUserStore : any = {}
import { useQuery } from '@tanstack/react-query';
import { Button, ModalBody, ModalFooter, useDisclosure } from '@chakra-ui/react';
import { useTranslation } from 'next-i18next';
import { LOGO_ICON } from 'src/functions/common/system/constants';
import { getSystemMsgModalData } from '@/web/support/user/inform/api';
import Markdown from 'src/components/Markdown';

const SystemMsgModal = ({}: {}) => {
  const { t } = useTranslation();
  const { systemMsgReadId, setSysMsgReadId } = useUserStore();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const { data } = useQuery(['initSystemMsgModal', systemMsgReadId], getSystemMsgModalData, {
    onSuccess(res) {
      if (res?.content && (!systemMsgReadId || res.id !== systemMsgReadId)) {
        onOpen();
      }
    }
  });

  const onclickRead = useCallback(() => {
    if (!data) return;
    setSysMsgReadId(data.id);
    onClose();
  }, [data, onClose, setSysMsgReadId]);

  return (
    <MyModal isOpen={isOpen} iconSrc={LOGO_ICON} title={t('support.user.inform.System message')}>
      <ModalBody overflow={'auto'}>
        <Markdown source={data?.content} />
      </ModalBody>
      <ModalFooter>
        <Button onClick={onclickRead}>{t('support.inform.Read')}</Button>
      </ModalFooter>
    </MyModal>
  );
};

export default React.memo(SystemMsgModal);