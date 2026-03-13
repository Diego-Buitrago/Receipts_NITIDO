
import { axiosApi } from "../../../api/axiosApi";
import ToastService from "../../../plugins/ToastService";
// import { sleep } from "../../../utils/others";
// INTERFACES
import { Pagination } from "../../../interfaces/ui";
import { AxiosError, BasicList } from "../../../interfaces/general";
import { UserForm, DataUser, UsersFilters } from "../interfaces/users";

type ResponseList = { results: DataUser[]; total: number; };

export const getUsers = async(pagination: Pagination, filters: UsersFilters):Promise<ResponseList> => {
    // await sleep(2);

    try {        
        const { data } = await axiosApi.post<ResponseList>('/list_users', { ...pagination, ...filters });
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return { results: [], total: 0 };
    }    
}


export const createUser = async(values: UserForm) => {
     try {        
        const { data } = await axiosApi.post('/create_user', values);
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }    
}

export const updateUser = async(values: UserForm, userId: number) => {
     try {        
        const { data } = await axiosApi.put('/update_user', {...values, userId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        throw error;
    }    
}

export const deleteUser = async(userId: number) => {
    try {        
        const { data } = await axiosApi.put('/delete_user', {userId});
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
       throw error;
    }    
}

export const getProfiles = async():Promise<BasicList[]> => {
    try {        
        const { data } = await axiosApi.get<BasicList[]>('/get_profiles');
        return data;
    } catch (error) {
        console.log(error);
        ToastService.apiError(error as AxiosError);
        return [];
    }    
}