import { format, formatDistanceToNow } from 'date-fns';

// ----------------------------------------------------------------------

export const currentDate = () => {
    return new Date().toISOString();
}

export function fDate(date: string) {
    return format(new Date(date), 'dd MMMM yyyy');
}

export function fDateTime(date: string) {
    return format(new Date(date), 'dd MMM yyyy HH:mm');
}

export function fDateTimeSuffix(date: string) {
    return format(new Date(date), 'dd/MM/yyyy hh:mm p');
}

export function fToNow(date: string) {
    return formatDistanceToNow(new Date(date), {
        addSuffix: true
    });
}  

export function fTime(date: string) {
    return format(new Date(date), 'HH:mm');
}

export const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };
