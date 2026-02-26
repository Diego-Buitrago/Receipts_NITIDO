import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ReceiptForm, SELLER_INFO } from '../Interfaces/receipt';
import { fCurrency } from '../../../utils/formatNumber';
import { formatDate } from '../../../utils/formatTime';
import logo from '../../../assets/logo.jpeg';
import ToastService from '../../../plugins/ToastService';

(pdfMake as unknown as { vfs: typeof pdfFonts.vfs }).vfs = pdfFonts.vfs;

// Función para convertir imagen a base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

export const generatePDF = async (data: ReceiptForm) => {
    // Convertir logo a base64
    const logoBase64 = await getBase64FromUrl(logo);

    const itemsTableBody = [
      [
        { text: 'Descripción', style: 'tableHeader' },
        { text: 'Cantidad', style: 'tableHeader', alignment: 'center' as const },
        { text: 'Precio Unit.', style: 'tableHeader', alignment: 'right' as const },
        { text: 'Subtotal', style: 'tableHeader', alignment: 'right' as const },
      ],
      ...data.items.map((item) => [
        item.description,
        { text: item.quantity.toString(), alignment: 'center' as const },
        { text: fCurrency(item.unitPrice), alignment: 'right' as const },
        { text: fCurrency(item.subtotal), alignment: 'right' as const },
      ]),
    ];

    const docDefinition = {
      content: [
        // Header con logo y título
        {
          columns: [
            {
              image: logoBase64,
              width: 60,
              margin: [0, 0, 10, 0] as [number, number, number, number],
            },
            {
              stack: [
                { text: 'Recibo de Venta', style: 'header' },
                { text: `No. ${data.receiptNumber}`, style: 'receiptNumber' },
                { text: `Fecha: ${formatDate(data.date)}`, style: 'date' },
              ],
              margin: [10, 5, 0, 0] as [number, number, number, number],
            },
          ],
          margin: [0, 0, 0, 20] as [number, number, number, number],
        },

        // Datos del Vendedor y Cliente en dos columnas
        {
          columns: [
            {
              width: '50%',
              stack: [
                { text: 'Datos del Vendedor', style: 'sectionTitle' },
                {
                  table: {
                    widths: ['auto', '*'],
                    body: [
                      [{ text: 'Nombre:', style: 'label' }, { text: SELLER_INFO.name, style: 'value' }],
                      [{ text: 'Documento:', style: 'label' }, { text: SELLER_INFO.document, style: 'value' }],
                      [{ text: 'Dirección:', style: 'label' }, { text: SELLER_INFO.address, style: 'value' }],
                      [{ text: 'Teléfono:', style: 'label' }, { text: SELLER_INFO.phone, style: 'value' }],
                    ],
                  },
                  layout: 'noBorders',
                },
              ],
            },
            {
              width: '50%',
              stack: [
                { text: 'Datos del Cliente', style: 'sectionTitle' },
                {
                  table: {
                    widths: ['auto', '*'],
                    body: [
                      [{ text: 'Nombre:', style: 'label' }, { text: data.customerName, style: 'value' }],
                      [{ text: 'Documento:', style: 'label' }, { text: data.customerDocument, style: 'value' }],
                      [{ text: 'Dirección:', style: 'label' }, { text: data.customerAddress || 'N/A', style: 'value' }],
                      [{ text: 'Teléfono:', style: 'label' }, { text: data.customerPhone || 'N/A', style: 'value' }],
                    ],
                  },
                  layout: 'noBorders',
                },
              ],
            },
          ],
          margin: [0, 0, 0, 15] as [number, number, number, number],
        },

        // Productos / Servicios
        { text: 'Productos / Servicios', style: 'sectionTitle' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 80, 80],
            body: itemsTableBody,
          },
          layout: {
            hLineWidth: (i: number, node: { table: { body: unknown[] } }) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
            vLineWidth: () => 0,
            hLineColor: () => '#e5e7eb',
            paddingLeft: () => 8,
            paddingRight: () => 8,
            paddingTop: () => 6,
            paddingBottom: () => 6,
          },
          margin: [0, 0, 0, 15] as [number, number, number, number],
        },

        // Pago y Resumen
        {
          columns: [
            {
              width: '55%',
              stack: [
                { text: 'Pago', style: 'sectionTitle' },
                {
                  table: {
                    widths: ['auto', '*'],
                    body: [
                      [{ text: 'Método de pago:', style: 'label' }, { text: data.paymentMethod, style: 'value' }],
                      ...(data.notes ? [[{ text: 'Observaciones:', style: 'label' }, { text: data.notes, style: 'value' }]] : []),
                    ],
                  },
                  layout: 'noBorders',
                },
              ],
            },
            {
              width: '45%',
              stack: [
                { text: 'Resumen', style: 'sectionTitle' },
                {
                  table: {
                    widths: ['*', 'auto'],
                    body: [
                      [{ text: 'Subtotal:', style: 'summaryLabel' }, { text: fCurrency(data.subtotal), style: 'summaryValue', alignment: 'right' as const }],
                      [{ text: 'Descuento:', style: 'summaryLabel' }, { text: fCurrency(data.discount), style: 'summaryValue', alignment: 'right' as const }],
                      [{ text: 'IVA (19%):', style: 'summaryLabel' }, { text: fCurrency(data.tax), style: 'summaryValue', alignment: 'right' as const }],
                      [
                        { text: 'TOTAL:', style: 'totalLabel' },
                        { text: fCurrency(data.total), style: 'totalValue', alignment: 'right' as const },
                      ],
                    ],
                  },
                  layout: 'noBorders',
                },
              ],
            },
          ],
        },

        // // Firma
        // {
        //   text: '\n\n_______________________________\nFirma del Cliente',
        //   alignment: 'center' as const,
        //   margin: [0, 40, 0, 0] as [number, number, number, number],
        //   fontSize: 10,
        // },
      ],
      styles: {
        header: { fontSize: 20, bold: true, color: '#1f2937' },
        receiptNumber: { fontSize: 11, color: '#6b7280' },
        date: { fontSize: 10, color: '#6b7280' },
        sectionTitle: { fontSize: 12, bold: true, color: '#374151', margin: [0, 10, 0, 8] as [number, number, number, number] },
        tableHeader: { bold: true, fontSize: 10, fillColor: '#f3f4f6', color: '#374151' },
        label: { fontSize: 9, bold: true, color: '#6b7280' },
        value: { fontSize: 9, color: '#1f2937' },
        summaryLabel: { fontSize: 10, color: '#374151' },
        summaryValue: { fontSize: 10, color: '#1f2937' },
        totalLabel: { fontSize: 12, bold: true, color: '#1f2937' },
        totalValue: { fontSize: 12, bold: true, color: '#16a34a' },
      },
      defaultStyle: { fontSize: 10 },
    };

    pdfMake.createPdf(docDefinition as never).download(`Recibo_${data.receiptNumber}.pdf`);
    ToastService.success('PDF generado exitosamente');
  };
