
export interface AxiosError extends Error {
    response?: {
        data?: {
            message: string;
        };
        status?: number;
    };
    request?: XMLHttpRequest;
}

export interface BasicForm {
  nombre: string;
  idestado: number;
}  

export interface BasicFilters {
  name: string;
  state: number | null
}

export interface BasicList {
  id: number;
  nombre: string;
}