import { toast } from 'sonner';

export const alertSuccess = (message: string) => {
  toast.success(message);
};

export const alertError = (message: string) => {
  toast.error(message);
};

export const alertWarning = (message: string) => {
  toast.warning(message);
};

export const alertInfo = (message: string) => {
  toast.info(message);
};
