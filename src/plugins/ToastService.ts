
import { Toast } from 'primereact/toast';
import { AxiosError } from '../interfaces/general';

class ToastService {
  private static toast: Toast | null = null;

  static setToast(toastInstance: Toast) {
    ToastService.toast = toastInstance;
  }

  static show(severity: 'success' | 'info' | 'warn' | 'error', message: string, sticky = false) {


    ToastService.toast?.show({
      severity,
      summary: 'Notificación',
      detail: message,
      life: 3000,
      sticky,
    });
  }

  static success(message: string, sticky = false) {
    ToastService.show('success', message, sticky);
  }

  static info(message: string, sticky = false) {
    ToastService.show('info', message, sticky);
  }

  static warn(message: string, sticky = false) {
    ToastService.show('warn', message, sticky);
  }

  static error(message: string, sticky = false) {
    ToastService.show('error', message, sticky);
  }

  static apiError(error: AxiosError) {
    if (error.response) {
      const { status, data } = error.response;
      if (status === 401) return ToastService.error('No autorizado');
      if (status === 403) return ToastService.error('Acceso denegado');
      if (status === 404) return ToastService.error('Api No encontrado');
      if (status === 500) return ToastService.error('Error interno del servidor');
      if (data?.message) return ToastService.error(data.message);
    } else if (error.request) {
      return ToastService.error('Error de red o el servidor no responde');
    } else {
      return ToastService.error(error.message);
    }
  }
}

export default ToastService;
