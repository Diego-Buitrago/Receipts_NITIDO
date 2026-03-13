import { useMutation,  useQueryClient } from "@tanstack/react-query";
// INTERFACES
import { DataUser, UserForm } from "../interfaces/users";
// HOOKS
import { ResultsList, useGetProfiles } from "./useUsers";
// SERVICES
import ToastService from "../../../plugins/ToastService";
import { createUser, deleteUser, updateUser } from "../services/usersServices";
// UTILS
import { optionStates } from "../../../utils/fixedLists";

export const useCreateUser = () => {
    const queryClient = useQueryClient();
    const { getProfilesQuery } = useGetProfiles();

    const mutation = useMutation({
        mutationFn: createUser,
        onMutate: (newUser: UserForm) => {
            // Optimistic user
            const optimisticUser: DataUser = { 
                ...newUser,
                userId: Math.random(),
                profileId: newUser.profileId || 0,
                profile: getProfilesQuery.data?.find(profile => profile.id === newUser.profileId)?.name || "",
                state: optionStates.find(state => state.id === newUser.stateId)?.name || "",
            };
            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listUsers'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;
            // Almacenar en el cache del query client
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {   
                    if (!old) return { total: 1, results: optimisticUser ? [optimisticUser] : [] };         
                    return { total: old.total + 1, results: [...old.results, optimisticUser] };
                }
            );

            return { optimisticUser, queryKey }
        },
        onSuccess: (res, _variables, context) => {
            if (!context?.queryKey) return;
            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                   if (!old) return { total: 1, results: [{...context.optimisticUser, userId: res.id }]};  
                    
                    // Actualizar en el cache del query client
                    const updatedResults = old.results.map(user =>  
                        user.userId === context.optimisticUser.userId 
                            ? { ...user, userId: res.id } 
                            : user
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
                    const data = old.results.filter((user: DataUser) => user.userId !== context?.optimisticUser.userId);
                    return { total: old.total - 1, results: data };
                }
            );
        }
    });

    return mutation;
}

export const useUpdateUser = (userId: number) => {
    const queryClient = useQueryClient();
    const { getProfilesQuery } = useGetProfiles();

    const mutation = useMutation({
        mutationFn: (values) => updateUser(values, userId),
        onMutate: (newUser: UserForm) => {
            // Optimistic user
            const optimisticUser: DataUser = { 
                ...newUser,
                userId: userId,
                profileId: newUser.profileId || 0,
                profile: getProfilesQuery.data?.find(profile => profile.id === newUser.profileId)?.name || "",
                state: optionStates.find(state => state.id === newUser.stateId)?.name || "",
            };

            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listUsers'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;
            const prevUser = queryClient.getQueryData<ResultsList>(queryKey)?.results.find(user => user.userId === userId);

            // Almacenar en el cache del query client
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {   
                    if (!old) return { total: 1, results: optimisticUser ? [optimisticUser] : [] };         
                    const updatedResults = old.results.map(user => 
                        user.userId === userId 
                            ? optimisticUser 
                            : user
                        );
                    return { total: old.total, results: updatedResults };
                }
            );

            return { prevUser, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message)
        },
        onError: (_error, _variables, context) => {
            if (!context?.queryKey) return;
            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                    if (!old || !context?.prevUser) {
                        return { 
                            total: context?.prevUser ? 1 : 0, 
                            results: context?.prevUser ? [context.prevUser] : [] 
                        };
                    }                 
            
                    const updatedResults = old.results.map(user => 
                        user.userId === userId && context.prevUser 
                            ? context.prevUser 
                            : user
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

export const useDeleteUser = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (user: DataUser) => deleteUser(user.userId),
        onMutate: (user) => {

            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listUsers'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            // Almacenar en el cache del query client
            if (!queryKey) return;
            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {                  
                    if (!old)  return { total: 0, results: [] };                     
                    const data = old.results.filter((u: DataUser) => u.userId !== user.userId);
                    return { total: old.total - 1, results: data };
                }
            );

            return { user, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message);
        },
        onError: (_error, _variables, context) => {
            if (!context?.queryKey) return;
            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {                  
                    if (!old)  return { total: 0, results: [] };                     
                    return { total: old.total, results: context?.user ? [...old.results, context.user] : [...old.results] };
                }
            );
        }
    });

    return mutation;
}