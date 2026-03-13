import { useMutation,  useQueryClient } from "@tanstack/react-query";
// SERVICES
import ToastService from "../../../plugins/ToastService";
// UTILS
import { optionStates } from "../../../utils/fixedLists";
import { createCustomer, deleteCustomer, updateCustomer } from "../services";
// INTERFACES
import { CustomerForm, DataCustomer } from "../interfaces/customers";
import { ResultsList } from "./useCustomers";

export const useCreateCustomer = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createCustomer,
        onMutate: (newCustomer: CustomerForm) => {
            const optimisticCustomer: DataCustomer = { 
                ...newCustomer,
                customerId: Math.random(),
                state: optionStates.find(state => state.id === newCustomer.stateId)?.name || "",
            };
            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listCustomers'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;
            // Almacenar en el cache del query client
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {   
                    if (!old) return { total: 1, results: optimisticCustomer ? [optimisticCustomer] : [] };         
                    return { total: old.total + 1, results: [...old.results, optimisticCustomer] };
                }
            );

            return { optimisticCustomer, queryKey }
        },
        onSuccess: (res, _variables, context) => {
            if (!context?.queryKey) return;
            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                   if (!old) return { total: 1, results: [{...context.optimisticCustomer, customerId: res.id }]};  
                    
                    // Actualizar en el cache del query client
                    const updatedResults = old.results.map(customer => 
                        customer.customerId === context.optimisticCustomer.customerId 
                            ? { ...customer, customerId: res.id } 
                            : customer
                        );
                    return { total: old.total, results: updatedResults };
                }
            );
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (!context?.queryKey) return;
            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                    if (!old)  return { total: 0, results: [] };                     
                    const data = old.results.filter((customer: DataCustomer) => customer.customerId !== context?.optimisticCustomer.customerId);
                    return { total: old.total - 1, results: data };
                }
            );
        }
    });

    return mutation;
}

export const useUpdateCustomer = (customerId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values) => updateCustomer(values, customerId),
        onMutate: (newCustomer: CustomerForm) => {
            // Optimistic data
            const optimisticCustomer: DataCustomer = { 
                ...newCustomer,
                customerId: customerId,
                state: optionStates.find(state => state.id === newCustomer.stateId)?.name || "",
            };

            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listCustomers'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;
            const prevCustomer = queryClient.getQueryData<ResultsList>(queryKey)?.results.find(customer => customer.customerId === customerId);

            // Almacenar en el cache del query client    
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {   
                    if (!old) return { total: 1, results: optimisticCustomer ? [optimisticCustomer] : [] };         
                    const updatedResults = old.results.map(customer => 
                        customer.customerId === customerId 
                            ? optimisticCustomer 
                            : customer
                        );
                    return { total: old.total, results: updatedResults };
                }
            );
            return { prevCustomer, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (context?.queryKey) {
                queryClient.setQueryData<ResultsList>(
                    context.queryKey,
                    (old) => {                  
                        if (!old || !context?.prevCustomer) {
                            return { 
                                total: context?.prevCustomer ? 1 : 0, 
                            results: context?.prevCustomer ? [context.prevCustomer] : [] 
                        };
                    }                 
            
                    const updatedResults = old.results.map(customer => 
                        customer.customerId === customerId && context.prevCustomer 
                            ? context.prevCustomer 
                            : customer
                    );
                
                    return { 
                        total: old.total, 
                        results: updatedResults 
                    };
                }
                );
            }
        }
    });

    return mutation;
}

export const useDeleteCustomer = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (customer: DataCustomer) => deleteCustomer(customer.customerId),
        onMutate: (customer) => {
            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listCustomers'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;
            // Actualizar optimistamente todas las queries de listCustomers            
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {
                    if (!old) return { total: 0, results: [] };
                    const data = old.results.filter((c: DataCustomer) => c.customerId !== customer.customerId);
                    return { total: old.total - 1, results: data };
                }
            );

            return { customer, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (!context?.queryKey) return;
            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {
                    if (!old) return { total: 0, results: [] };
                    return { total: old.total, results: context.customer ? [...old.results, context.customer] : [...old.results] };
                }
            );
        }
    });

    return mutation;
}