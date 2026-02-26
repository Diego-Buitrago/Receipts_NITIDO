export interface ReceiptItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ReceiptForm {
  receiptNumber: string;
  date: Date;
  // Customer data
  customerName: string;
  customerDocument: string;
  customerPhone: string;
  customerAddress: string;
  // Receipt items
  items: ReceiptItem[];
  // Totals
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  // Payment
  paymentMethod: string;
  notes: string;
}

export interface PaymentMethod {
  name: string;
  value: string;
}

export const PAYMENT_METHODS: PaymentMethod[] = [
  { name: 'Efectivo', value: 'Efectivo' },
  { name: 'Tarjeta de Crédito', value: 'Tarjeta de Crédito' },
  { name: 'Tarjeta de Débito', value: 'Tarjeta de Débito' },
  { name: 'Transferencia', value: 'Transferencia' },
  { name: 'Nequi', value: 'Nequi' },
  { name: 'Daviplata', value: 'Daviplata' },
];

// Datos del vendedor
export const SELLER_INFO = {
  name: 'Gabriel Jaime Velásquez Álvarez',
  document: '3438630',
  address: 'Km1+600 vía llanogrande el tablazo Rionegro Antioquia',
  phone: '3183807303',
};
