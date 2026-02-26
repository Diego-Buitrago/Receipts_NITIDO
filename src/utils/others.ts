import { statusBodyTemplate } from "../components";
import { BasicFilters } from "../interfaces/general";
import { TableCenter } from "../interfaces/ui";
import { optionStates } from "./fixedLists";

export const sleep = (seconds: number = 1):Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, seconds * 1000);
    });
}

export const columnsConfig =  [
    {
        field: "nombre",
        header: "Nombres",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "15rem", minWidth: "15rem" },
    },
    {
        field: "estado",
        header: "Estado",
        sortable: true,
        style: { flexGrow: 1, flexBasis: "5rem", minWidth: "5rem" },
        align: "center" as TableCenter,
        body: statusBodyTemplate
    },   
];

export const getFilterConfig = (filters: BasicFilters) => [
    { key: "name", type: "input", label: "Nombre", props: { defaultValue: filters.name } },   
    {
        key: "state",
        type: "dropdown",
        label: "Estado",
        props: {
            options: optionStates,
            value: filters.state,
        },
    },
]

export const initialFilters: BasicFilters = { name: '', state: null };

export const truncateText = (text: string, maxLength: number = 100) => {
    if (!text) return "";
    if (text.length > maxLength) {
        return text.substring(0, maxLength) + "...";
    }
    return text;
};

export const sprintf = (string: string | number | null | undefined, cant: number = 4, pos: "L" | "R" = "L", replace: string = "0") => {
    if (string || string === 0) {
        return pos === "L"
            ? string.toString().padStart(cant, replace)
            : string.toString().padEnd(cant, replace);
    } else return "";
};
