import React from 'react';
import { PermissionTypeEnum, PermissionTypeMap } from 'src/functions/support/permission/constant';
import { Box, Flex, FlexProps } from '@chakra-ui/react';
import MyIcon from 'src/functions/web/components/common/Icon';
import { useTranslation } from 'next-i18next';

const PermissionIconText = ({
  permission,
  ...props
}: { permission: `${PermissionTypeEnum}` } & FlexProps) => {
  const { t } = useTranslation();
  return PermissionTypeMap[permission] ? (
    <Flex alignItems={'center'} {...props}>
      <MyIcon name={PermissionTypeMap[permission]?.iconLight as any} w={'14px'} />
      <Box ml={'2px'} lineHeight={1}>
        {t(PermissionTypeMap[permission]?.label)}
      </Box>
    </Flex>
  ) : null;
};

export default PermissionIconText;
