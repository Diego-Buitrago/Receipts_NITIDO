import { axiosApi } from "../../../api/axiosApi";
import ToastService from "../../../plugins/ToastService";
// Interfaces
import { AxiosError, BasicList } from "../../../interfaces/general";
import { Pagination } from "../../../interfaces/ui";
import { DataReceipt, CountReceiptsByStatus, ReceiptFilters, ReceiptForm, ReceiptDetail } from "../Interfaces/receipt";

type ResponseList = { results: DataReceipt[]; total: number; };

export const listReceipts = async(pagination: Pagination, filters: ReceiptFilters):Promise<ResponseList> => {
    try {
        const { data } = await axiosApi.post<ResponseList>('/list_receipts', { ...pagination, ...filters });
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return { results: [], total: 0 };
    }
}

export const createReceipt = async(values: ReceiptForm) => {
     try {
        const { data } = await axiosApi.post('/create_receipt', values);
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }
}

export const updateReceipt = async(values: ReceiptForm, receiptId: number) => {
    try {
        const { data } = await axiosApi.put('/update_receipt', {...values, receiptId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }
}

export const cancelReceipt = async(receiptId: number) => {
    try {
        const { data } = await axiosApi.put('/cancel_receipt', {receiptId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
       throw error;
    }
}

export const getTypePayments = async():Promise<BasicList[]> => {
    try {
        const { data } = await axiosApi.get<BasicList[]>('/get_type_payments');
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }
}

export const getReceiptStates = async():Promise<BasicList[]> => {
    try {
        const { data } = await axiosApi.get<BasicList[]>('/get_receipt_states');
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }
}

export const countReceiptsByStatus = async():Promise<CountReceiptsByStatus[]> => {
    try {
        const { data } = await axiosApi.get<CountReceiptsByStatus[]>('/count_receipts_by_status');
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }
}

export const getReceiptDetails = async(receiptId: number):Promise<ReceiptDetail[]> => {
    try {
        const { data } = await axiosApi.get<ReceiptDetail[]>(`/get_receipt_details/${receiptId}`);
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }
}

export const generateReceiptPDF = async (receiptId: number): Promise<string> => {
    try {
        const { data } = await axiosApi.get(`/generate_pdf/${receiptId}`, {
            responseType: 'blob'
        });
        const blob = new Blob([data], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        // const url = window.URL.createObjectURL(new Blob([data]));
        // const a = document.createElement('a');
        // a.href = url;
        // a.download = filename;
        // document.body.appendChild(a);
        // a.click();
        // a.remove();
        // window.URL.revokeObjectURL(url);
        
        return url;
    } catch (error) {
        console.error('Error al descargar PDF:', error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }
}