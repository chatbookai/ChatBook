import { useToast } from './useToast';
import { useMutation } from '@tanstack/react-query';
import type { UseMutationOptions } from '@tanstack/react-query';
import { getErrText } from 'src/functions/common/error/utils';
import { useTranslation } from 'next-i18next';

interface Props extends UseMutationOptions<any, any, any, any> {
  successToast?: string | null;
  errorToast?: string | null;
}

export const useRequest = ({ successToast, errorToast, onSuccess, onError, ...props }: Props) => {
  const { toast } = useToast();
  const { t } = useTranslation();
  return {};
};
