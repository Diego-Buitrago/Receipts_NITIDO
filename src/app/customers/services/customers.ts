import { axiosApi } from "../../../api/axiosApi";
import { AxiosError, BasicList } from "../../../interfaces/general";
import { Pagination } from "../../../interfaces/ui";
import ToastService from "../../../plugins/ToastService";
import { CustomerFilters, CustomerForm, DataCustomer } from "../interfaces/customers";

type ResponseList = { results: DataCustomer[]; total: number; };

export const listCustomers = async(pagination: Pagination, filters: CustomerFilters):Promise<ResponseList> => {
    try {        
        const { data } = await axiosApi.post<ResponseList>('/list_customers', { ...pagination, ...filters });
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return { results: [], total: 0 };
    }    
}

export const createCustomer = async(values: CustomerForm) => {
     try {        
        const { data } = await axiosApi.post('/create_customer', values);
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }    
}

export const updateCustomer = async(values: CustomerForm, customerId: number) => {
    try {        
        const { data } = await axiosApi.put('/update_customer', {...values, customerId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }    
}

export const deleteCustomer = async(customerId: number) => {
    try {        
        const { data } = await axiosApi.put('/delete_customer', {customerId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
       throw error;
    }    
}

export const getCustomers = async(customerId: number | null):Promise<BasicList[]> => {
    try {        
        const { data } = await axiosApi.get<BasicList[]>('/get_customers', { params: { customerId } });
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }    
}