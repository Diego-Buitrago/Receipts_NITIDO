import { axiosApi } from "../../../api/axiosApi";
import ToastService from "../../../plugins/ToastService";
// Interfaces
import { AxiosError, BasicList } from "../../../interfaces/general";
import { Pagination } from "../../../interfaces/ui";
import { DataProduct, ProductFilters, ProductForm } from "../interfaces/products";

type ResponseList = { results: DataProduct[]; total: number; };

export const listProducts = async(pagination: Pagination, filters: ProductFilters):Promise<ResponseList> => {
    try {        
        const { data } = await axiosApi.post<ResponseList>('/list_products', { ...pagination, ...filters });
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return { results: [], total: 0 };
    }    
}

export const createProduct = async(values: ProductForm) => {
     try {        
        const { data } = await axiosApi.post('/create_product', values);
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }    
}

export const updateProduct = async(values: ProductForm, productId: number) => {
    try {        
        const { data } = await axiosApi.put('/update_product', {...values, productId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }    
}

export const deleteProduct = async(productId: number) => {
    try {        
        const { data } = await axiosApi.put('/delete_product', {productId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
       throw error;
    }    
}

export const getProducts = async(productId: number | null):Promise<(BasicList & { price: number })[]> => {
    try {        
        const { data } = await axiosApi.get<(BasicList & { price: number })[]>('/get_products', { params: { productId } });
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }    
}