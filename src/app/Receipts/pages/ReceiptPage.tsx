import { useState } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';
import { FaPlus, FaTrash, FaFilePdf } from 'react-icons/fa';
import { ReceiptForm, ReceiptItem, PAYMENT_METHODS, SELLER_INFO } from '../Interfaces/receipt';
import logo from '../../../assets/logo.jpeg';
import { fCurrency } from '../../../utils/formatNumber';
import { generatePDF } from '../utils/generatedReceipt';
import { propsCalendar, propsCurrency, propsSelect } from '../../../utils/defaultProps';

const defaultValues: ReceiptForm = {
    receiptNumber: '',
    date: new Date(),
    customerName: '',
    customerDocument: '',
    customerPhone: '',
    customerAddress: '',
    items: [],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    paymentMethod: 'Efectivo',
    notes: '',
};

const ReceiptPage = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    getValues,
  } = useForm<ReceiptForm>({
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  // Observar items para actualizaciones reactivas de UI (fields de useFieldArray NO es reactivo a setValue)
  const watchedItems = watch('items');

  // Combinar fields (para IDs) con watchedItems (para valores reactivos) para DataTable
  const tableData = fields.map((field, index) => ({
    ...field,
    ...watchedItems?.[index],
  }));

  // Calcular totales cuando los items o el descuento cambien
  const calculateTotals = () => {
    const items = getValues('items');
    const discount = getValues('discount') || 0;
    const subtotal = items.reduce((acc, item) => acc + (item.subtotal || 0), 0);
    const tax = subtotal * 0.19; // IVA 19%
    const total = subtotal + tax - discount;

    setValue('subtotal', subtotal);
    setValue('tax', tax);
    setValue('total', total);
  };

  // Agregar nuevo item
  const addItem = () => {
    const newItem: ReceiptItem = {
      id: crypto.randomUUID(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
    };
    append(newItem);
  };

  // Calcular subtotal del item
  const calculateItemSubtotal = (index: number, quantity: number, unitPrice: number) => {
    const subtotal = quantity * unitPrice;
    setValue(`items.${index}.subtotal`, subtotal);
    setTimeout(calculateTotals, 0);
  };

  const onSubmit = async (data: ReceiptForm) => {
    setIsGenerating(true);
    try {
      await generatePDF(data);
    } finally {
      setIsGenerating(false);
    }
  };

  // Plantilla de acciones para la tabla
  const actionsTemplate = (_: ReceiptItem, options: { rowIndex: number }) => {
    return (
      <Button
        icon={<FaTrash />}
        rounded
        severity="danger"
        size="small"
        onClick={() => {
          remove(options.rowIndex);
          setTimeout(calculateTotals, 0);
        }}
      />
    );
  };

  // Plantilla del campo descripción
  const descriptionTemplate = (_: ReceiptItem, options: { rowIndex: number }) => {
    return (
      <Controller
        name={`items.${options.rowIndex}.description`}
        control={control}
        rules={{ required: 'La descripción es requerida' }}
        render={({ field, fieldState }) => (
          <InputText
            {...field}
            placeholder="Descripción del producto/servicio"
            className={classNames('w-full', { 'p-invalid': fieldState.error })}
          />
        )}
      />
    );
  };

  // Plantilla del campo cantidad
  const quantityTemplate = (_: ReceiptItem, options: { rowIndex: number }) => {
    return (
      <Controller
        name={`items.${options.rowIndex}.quantity`}
        control={control}
        rules={{ required: true, min: 1 }}
        render={({ field, fieldState }) => (
          <InputNumber
            value={field.value}
            onValueChange={(e) => {
              field.onChange(e.value);
              calculateItemSubtotal(
                options.rowIndex,
                e.value || 0,
                getValues(`items.${options.rowIndex}.unitPrice`) || 0
              );
            }}
            min={1}
            showButtons
            className={classNames('w-full h-10', { 'p-invalid': fieldState.error })}
          />
        )}
      />
    );
  };

  // Plantilla del campo precio unitario
  const unitPriceTemplate = (_: ReceiptItem, options: { rowIndex: number }) => {
    return (
      <Controller
        name={`items.${options.rowIndex}.unitPrice`}
        control={control}
        rules={{ required: true, min: 0 }}
        render={({ field, fieldState }) => (
          <InputNumber
            value={field.value}
            onValueChange={(e) => {
              field.onChange(e.value);
              calculateItemSubtotal(
                options.rowIndex,
                getValues(`items.${options.rowIndex}.quantity`) || 0,
                e.value || 0
              );
            }}
            {...propsCurrency}
            className={classNames('w-full', { 'p-invalid': fieldState.error })}
          />
        )}
      />
    );
  };

  // Plantilla de subtotal - usa tableData reactivo
  const subtotalTemplate = (rowData: ReceiptItem) => {
    const subtotal = (rowData.quantity || 0) * (rowData.unitPrice || 0);
    return <span className="font-semibold">{fCurrency(subtotal)}</span>;
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <Card
          title={
            <div className="flex items-center gap-4">
              <img src={logo} alt="NITIDO Logo" className="h-16 w-auto" />
              <span>Recibo de Venta</span>
            </div>
          }
          className="shadow-lg"
        >
        <form onSubmit={handleSubmit(onSubmit)} >
          {/* Información del Recibo */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="flex flex-col gap-2">
              <label htmlFor="receiptNumber" className="font-semibold">
                Número de Recibo *
              </label>
              <Controller
                name="receiptNumber"
                control={control}
                rules={{ required: 'El número de recibo es requerido' }}
                render={({ field, fieldState }) => (
                  <>
                    <InputText
                      id="receiptNumber"
                      {...field}
                      placeholder="Ej: REC-001"
                      className={classNames({ 'p-invalid': fieldState.error })}
                    />
                    {fieldState.error && (
                      <small className="text-red-500">{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="date" className="font-semibold">
                Fecha *
              </label>
              <Controller
                name="date"
                control={control}
                rules={{ required: 'La fecha es requerida' }}
                render={({ field, fieldState }) => (
                  <>
                    <Calendar
                      id="date"
                      {...propsCalendar}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}                     
                      className={classNames({ 'p-invalid': fieldState.error })}
                    />
                    {fieldState.error && (
                      <small className="text-red-500">{fieldState.error.message}</small>
                    )}
                  </>
                )}
              />
            </div>
          </div>

          {/* Datos del Vendedor y Cliente - Dos Columnas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Datos del Vendedor */}
            <div>
              <Divider align="left">
                <span className="text-lg font-semibold text-gray-600">Datos del Vendedor</span>
              </Divider>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-col gap-2">
                <div>
                  <span className="font-semibold">Nombre: </span>
                  <span>{SELLER_INFO.name}</span>
                </div>
                <div>
                  <span className="font-semibold">Documento: </span>
                  <span>{SELLER_INFO.document}</span>
                </div>
                <div>
                  <span className="font-semibold">Dirección: </span>
                  <span>{SELLER_INFO.address}</span>
                </div>
                <div>
                  <span className="font-semibold">Teléfono: </span>
                  <span>{SELLER_INFO.phone}</span>
                </div>
              </div>
            </div>

            {/* Datos del Cliente */}
            <div>
              <Divider align="left">
                <span className="text-lg font-semibold text-gray-600">Datos del Cliente</span>
              </Divider>
              <div className="flex flex-col gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="customerName" className="font-semibold">
                      Nombre *
                    </label>
                    <Controller
                      name="customerName"
                      control={control}
                      rules={{ required: 'El nombre del cliente es requerido' }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            id="customerName"
                            {...field}
                            placeholder="Nombre completo"
                            className={classNames({ 'p-invalid': fieldState.error })}
                          />
                          {fieldState.error && (
                            <small className="text-red-500">{fieldState.error.message}</small>
                          )}
                        </>
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="customerDocument" className="font-semibold">
                      Documento *
                    </label>
                    <Controller
                      name="customerDocument"
                      control={control}
                      rules={{ required: 'El documento es requerido' }}
                      render={({ field, fieldState }) => (
                        <>
                          <InputText
                            id="customerDocument"
                            {...field}
                            placeholder="Cédula o NIT"
                            className={classNames({ 'p-invalid': fieldState.error })}
                          />
                          {fieldState.error && (
                            <small className="text-red-500">{fieldState.error.message}</small>
                          )}
                        </>
                      )}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label htmlFor="customerPhone" className="font-semibold">
                      Teléfono
                    </label>
                    <Controller
                      name="customerPhone"
                      control={control}
                      render={({ field }) => (
                        <InputText id="customerPhone" {...field} placeholder="Número de contacto" />
                      )}
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label htmlFor="customerAddress" className="font-semibold">
                      Dirección
                    </label>
                    <Controller
                      name="customerAddress"
                      control={control}
                      render={({ field }) => (
                        <InputText id="customerAddress" {...field} placeholder="Dirección" />
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Divider align="left">
            <span className="text-lg font-semibold text-gray-600">Productos / Servicios</span>
          </Divider>

          {/* Tabla de Items */}
          <div className="mb-4">
            <Button
              type="button"
              label="Agregar Item"
              icon={<FaPlus className="mr-2" />}
              onClick={addItem}
              className="mb-4"
              severity="success"
            />

            <DataTable
              value={tableData}
              emptyMessage="No hay items agregados"
              className="mb-4"
              stripedRows
              showGridlines
              scrollable
            >
              <Column
                header="Descripción"
                body={descriptionTemplate}
                style={{ width: '40%' }}
              />
              <Column
                header="Cantidad"
                body={quantityTemplate}
                style={{ width: '15%' }}
              />
              <Column
                header="Precio Unitario"
                body={unitPriceTemplate}
                style={{ width: '20%' }}
              />
              <Column
                header="Subtotal"
                body={subtotalTemplate}
                style={{ width: '15%' }}
              />
              <Column
                header=""
                body={actionsTemplate}
                style={{ width: '10%' }}
              />
            </DataTable>
          </div>

          {/* Totales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Divider align="left">
                <span className="text-lg font-semibold text-gray-600">Pago</span>
              </Divider>

              <div className="flex flex-col gap-2 mb-4">
                <label htmlFor="paymentMethod" className="font-semibold">
                  Método de Pago *
                </label>
                <Controller
                  name="paymentMethod"
                  control={control}
                  rules={{ required: 'Seleccione un método de pago' }}
                  render={({ field, fieldState }) => (
                      <>
                      <Dropdown
                        id="paymentMethod"
                        {...propsSelect}
                        optionValue="value"
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        options={PAYMENT_METHODS}
                        placeholder="Seleccione método de pago"
                        className={classNames('w-full', { 'p-invalid': fieldState.error })}
                      />
                      {fieldState.error && (
                        <small className="text-red-500">{fieldState.error.message}</small>
                      )}
                    </>
                  )}
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="notes" className="font-semibold">
                  Observaciones
                </label>
                <Controller
                  name="notes"
                  control={control}
                  render={({ field }) => (
                    <InputTextarea
                      id="notes"
                      {...field}
                      rows={3}
                      placeholder="Notas adicionales del recibo..."
                      className="w-full"
                    />
                  )}
                />
              </div>
            </div>

            <div>
              <Divider align="left">
                <span className="text-lg font-semibold text-gray-600">Resumen</span>
              </Divider>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between mb-2">
                  <span>Subtotal:</span>
                  <span className="font-semibold">{fCurrency(watch('subtotal'))}</span>
                </div>

                <div className="flex justify-between items-center mb-2">
                  <span>Descuento:</span>
                  <Controller
                    name="discount"
                    control={control}
                    render={({ field }) => (
                      <InputNumber
                        {...propsCurrency}
                        value={field.value}
                        onValueChange={(e) => {
                          field.onChange(e.value);
                          setTimeout(calculateTotals, 0);
                        }}
                        inputClassName="text-right"
                      />
                    )}
                  />
                </div>

                <div className="flex justify-between mb-2">
                  <span>IVA (19%):</span>
                  <span className="font-semibold">{fCurrency(watch('tax'))}</span>
                </div>

                <Divider />

                <div className="flex justify-between text-xl">
                  <span className="font-bold">TOTAL:</span>
                  <span className="font-bold text-green-600">
                    {fCurrency(watch('total'))}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Botón de Enviar */}
          <div className="flex justify-end mt-6">
            <Button
              type="submit"
              label="Exportar PDF"
              icon={<FaFilePdf className="mr-2" />}
              severity="success"
              loading={isGenerating}
              disabled={fields.length === 0}
            />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ReceiptPage;
