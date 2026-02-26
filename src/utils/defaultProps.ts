import { FooterPassword, HeaderPassword } from "../components";

export const propsDataTable = {
    showGridlines: true,
    stripedRows: true,
    scrollable: true,
    paginator: true,
    lazy: true,
    emptyMessage: "No se encontraron datos",
    paginatorTemplate: "CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown",
    currentPageReportTemplate: "{first} a {last} de {totalRecords}",
    rowsPerPageOptions: [5, 10, 20, 50],
};

export const propsPass = {
    weakLabel: "Débil",
    mediumLabel: "Media",
    strongLabel: "Alto",
    header: HeaderPassword,
    footer: FooterPassword,
    toggleMask: true,
    style: { width: "100%" },
};

export const propsSelect = {
    resetFilterOnHide: true,
    emptyMessage: "No Hay Datos",
    emptyFilterMessage: "No Hay Datos",
    optionLabel: "name",
    filterBy: "name",
    optionValue: "id",
    filter: true,
    showClear: true,
    onBlur: () => null
};

export const propsSelectButton = {
    optionLabel: "name",
    optionValue: "id",
    unselectable: false,
};


export const propsCurrency = {
    mode: "currency" as "currency" | "decimal" | undefined,
    currency: "COP", 
    locale: "es-CO",
    min: 0, 
    max: 100000000,
    minFractionDigits: 0,
};

export const propsCalendar = {
    showButtonBar: true,
    showIcon: true,
    readOnlyInput: true,
    dateFormat: "yy-mm-dd",
    monthNavigator: true,
    yearNavigator: true,
    yearRange: "2000:2050",
    locale: "es",
};

export const propsDialog = {
    maximizable: true,
    draggable: true,   
    visible: true,
    headerStyle: { backgroundColor: "#0f766e", color: 'white', padding: "1rem" },
    breakpoints: { "1584px": "40vw", "1200px": "50vw", "960px": "80vw", "672px": "100vw" },
    style: { width: "45vw" }
};