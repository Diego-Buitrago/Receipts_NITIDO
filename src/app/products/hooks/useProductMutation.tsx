import { useMutation,  useQueryClient } from "@tanstack/react-query";
// SERVICES
import ToastService from "../../../plugins/ToastService";
import { createProduct, deleteProduct, updateProduct } from "../services";
// UTILS
import { optionStates } from "../../../utils/fixedLists";
// INTERFACES
import { DataProduct, ProductForm } from "../interfaces/products";
import { ResultsList } from "./useProducts";

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: createProduct,
        onMutate: (newProduct: ProductForm) => {
            const optimisticProduct: DataProduct = { 
                ...newProduct,
                productId: Math.random(),
                state: optionStates.find(state => state.id === newProduct.stateId)?.name || "",
            };
            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listProducts'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;

            // Almacenar en el cache del query client
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {   
                    if (!old) return { total: 1, results: optimisticProduct ? [optimisticProduct] : [] };         
                    return { total: old.total + 1, results: [...old.results, optimisticProduct] };
                }
            );

            return { optimisticProduct, queryKey }
        },
        onSuccess: (res, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                   if (!old) return { total: 1, results: [{...context.optimisticProduct, productId: res.id }]};  
                    
                    // Actualizar en el cache del query client
                    const updatedResults = old.results.map(product => 
                        product.productId === context.optimisticProduct.productId 
                            ? { ...product, productId: res.id } 
                            : product
                        );
                    return { total: old.total, results: updatedResults };
                }
            );
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                    if (!old)  return { total: 0, results: [] };                     
                    const data = old.results.filter((product: DataProduct) => product.productId !== context.optimisticProduct.productId);
                    return { total: old.total - 1, results: data };
                }
            );
        }
    });

    return mutation;
}

export const useUpdateProduct = (productId: number) => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (values) => updateProduct(values, productId),
        onMutate: (newProduct: ProductForm) => {
            // Optimistic data
            const optimisticProduct: DataProduct = { 
                ...newProduct,
                productId: productId,
                state: optionStates.find(state => state.id === newProduct.stateId)?.name || "",
            };

            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listProducts'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;

            const prevProduct = queryClient.getQueryData<ResultsList>(queryKey)?.results.find(product => product.productId === productId);

            // Almacenar en el cache del query client
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {   
                    if (!old) return { total: 1, results: optimisticProduct ? [optimisticProduct] : [] };         
                    const updatedResults = old.results.map(product => 
                        product.productId === productId 
                            ? optimisticProduct 
                            : product
                        );
                    return { total: old.total, results: updatedResults };
                }
            );

            return { prevProduct, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                    if (!old || !context.prevProduct) {
                        return { 
                            total: context.prevProduct ? 1 : 0, 
                            results: context?.prevProduct ? [context.prevProduct] : [] 
                        };
                    }                 
            
                    const updatedResults = old.results.map(product => 
                        product.productId === productId && context.prevProduct 
                            ? context.prevProduct 
                            : product
                    );
                
                    return { 
                        total: old.total, 
                        results: updatedResults 
                    };
                }
            );
        }
    });

    return mutation;
}

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (product: DataProduct) => deleteProduct(product.productId),
        onMutate: (product) => {

            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listProducts'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;

            // Almacenar en el cache del query client
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {                  
                    if (!old)  return { total: 0, results: [] };                     
                    const data = old.results.filter((p: DataProduct) => p.productId !== product.productId);
                    return { total: old.total - 1, results: data };
                }
            );

            return { product, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                    if (!old)  return { total: 0, results: [] };                     
                    return { total: old.total, results: context.product ? [...old.results, context.product] : [...old.results] };
                }
            );
        }
    });

    return mutation;
}