import { useMutation, useQueryClient } from "@tanstack/react-query";
// SERVICES
import ToastService from "../../../plugins/ToastService";
import { createReceipt, cancelReceipt, updateReceipt, generateReceiptPDF } from "../services";
// UTILS
import { optionStates } from "../../../utils/fixedLists";
// INTERFACES
import { DataReceipt, ReceiptForm } from "../Interfaces/receipt";
import { ResultsList, useGetTypePayments } from "./useReceipts";
// HOOKS
import { useGetCustomers } from "../../customers/hooks";

export const useCreateReceipt = () => {
    const queryClient = useQueryClient();
    const { getTypePaymentsQuery } = useGetTypePayments();
    const { getCustomersQuery } = useGetCustomers();

    const mutation = useMutation({
        mutationFn: createReceipt,
        onMutate: (newReceipt: ReceiptForm) => {
            const optimisticReceipt: DataReceipt = {
                receiptId: Math.random(),
                prefix: 'REC',
                receiptNumber: `REC-${Date.now()}`,
                date: newReceipt.date,
                customerId: newReceipt.customerId || 0,
                customer: getCustomersQuery.data?.find(c => c.id === newReceipt.customerId)?.name || "",
                typePaymentId: newReceipt.typePaymentId || 0,
                typePayment: getTypePaymentsQuery.data?.find(tp => tp.id === newReceipt.typePaymentId)?.name || "",
                subtotal: newReceipt.subtotal,
                discount: newReceipt.discount,
                tax: newReceipt.tax,
                total: newReceipt.total,
                observation: newReceipt.observation,
                stateId: newReceipt.stateId,
                state: optionStates.find(state => state.id === newReceipt.stateId)?.name || "",
            };
            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listReceipts'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;

            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {
                    if (!old) return { total: 1, results: optimisticReceipt ? [optimisticReceipt] : [] };
                    return { total: old.total + 1, results: [optimisticReceipt, ...old.results] };
                }
            );

            return { optimisticReceipt, queryKey }
        },
        onSuccess: (res, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {
                   if (!old) return { total: 1, results: [{...context.optimisticReceipt, receiptId: res.id }]};

                    const updatedResults = old.results.map(receipt =>
                        receipt.receiptId === context.optimisticReceipt.receiptId
                            ? { ...receipt, receiptId: res.id, receiptNumber: res.receiptNumber || receipt.receiptNumber }
                            : receipt
                        );
                    return { total: old.total, results: updatedResults };
                }
            );
            ToastService.success(res?.message);
            queryClient.invalidateQueries({ queryKey: ['listReceipts'] });
            queryClient.invalidateQueries({ queryKey: ['countReceiptsByStatus'] });
        },
        onError: (_error, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {
                    if (!old)  return { total: 0, results: [] };
                    const data = old.results.filter((receipt: DataReceipt) => receipt.receiptId !== context.optimisticReceipt.receiptId);
                    return { total: old.total - 1, results: data };
                }
            );
        }
    });

    return mutation;
}

export const useUpdateReceipt = (receiptId: number) => {
    const queryClient = useQueryClient();
    const { getTypePaymentsQuery } = useGetTypePayments();
    const { getCustomersQuery } = useGetCustomers();

    const mutation = useMutation({
        mutationFn: (values: ReceiptForm) => updateReceipt(values, receiptId),
        onMutate: (newReceipt: ReceiptForm) => {
            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listReceipts'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;

            const prevReceipt = queryClient.getQueryData<ResultsList>(queryKey)?.results.find(receipt => receipt.receiptId === receiptId);

            const optimisticReceipt: DataReceipt = {
                receiptId: receiptId,
                prefix: prevReceipt?.prefix || 'REC',
                receiptNumber: prevReceipt?.receiptNumber || '',
                date: newReceipt.date,
                customerId: newReceipt.customerId || 0,
                customer: getCustomersQuery.data?.find(c => c.id === newReceipt.customerId)?.name || "",
                typePaymentId: newReceipt.typePaymentId || 0,
                typePayment: getTypePaymentsQuery.data?.find(tp => tp.id === newReceipt.typePaymentId)?.name || "",
                subtotal: newReceipt.subtotal,
                discount: newReceipt.discount,
                tax: newReceipt.tax,
                total: newReceipt.total,
                observation: newReceipt.observation,
                stateId: newReceipt.stateId,
                state: optionStates.find(state => state.id === newReceipt.stateId)?.name || "",
            };

            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {
                    if (!old) return { total: 1, results: optimisticReceipt ? [optimisticReceipt] : [] };
                    const updatedResults = old.results.map(receipt =>
                        receipt.receiptId === receiptId
                            ? optimisticReceipt
                            : receipt
                        );
                    return { total: old.total, results: updatedResults };
                }
            );

            return { prevReceipt, queryKey }
        },
        onSuccess: (res) => {
            ToastService.success(res?.message);
            queryClient.invalidateQueries({ queryKey: ['listReceipts'] });
            queryClient.invalidateQueries({ queryKey: ['countReceiptsByStatus'] });
            queryClient.invalidateQueries({ queryKey: ['receiptDetails', receiptId] });
        },
        onError: (_error, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {
                    if (!old || !context.prevReceipt) {
                        return {
                            total: context.prevReceipt ? 1 : 0,
                            results: context?.prevReceipt ? [context.prevReceipt] : []
                        };
                    }

                    const updatedResults = old.results.map(receipt =>
                        receipt.receiptId === receiptId && context.prevReceipt
                            ? context.prevReceipt
                            : receipt
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

export const useCancelReceipt = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (receipt: DataReceipt) => cancelReceipt(receipt.receiptId),
        onMutate: (receipt) => {

            const queryCache = queryClient.getQueryCache();
            const todosQueries = queryCache.findAll({ queryKey: ['listReceipts'] });
            const queryKey = todosQueries.at(-1)?.queryKey;

            if (!queryKey) return;

            queryClient.setQueryData<ResultsList>(
                queryKey,
                (old) => {
                    if (!old)  return { total: 0, results: [] };
                    const data = old.results.filter((r: DataReceipt) => r.receiptId !== receipt.receiptId);
                    return { total: old.total - 1, results: data };
                }
            );

            return { receipt, queryKey }
        },
        onSuccess: (res, variables) => {
            ToastService.success(res?.message);
            queryClient.invalidateQueries({ queryKey: ['listReceipts'] });
            queryClient.invalidateQueries({ queryKey: ['countReceiptsByStatus'] });
            queryClient.invalidateQueries({ queryKey: ['receiptDetails', variables.receiptId] });
        },
        onError: (_error, _variables, context) => {
            if (!context) return;

            queryClient.setQueryData<ResultsList>(
                context.queryKey,
                (old) => {
                    if (!old)  return { total: 0, results: [] };
                    return { total: old.total, results: context.receipt ? [...old.results, context.receipt] : [...old.results] };
                }
            );
        }
    });

    return mutation;
}

export const useGenerateReceiptPDF = () => {
    const mutation = useMutation({
        mutationFn: (receiptId: number) => generateReceiptPDF(receiptId),
        onSuccess: (res) => {
            return res;
        }
    });

    return mutation;
}
