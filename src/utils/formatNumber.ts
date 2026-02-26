import numeral from "numeral";

// ----------------------------------------------------------------------

export const fCurrency = (number: number) => {
    return numeral(number).format(Number.isInteger(number) ? "$0,0" : "$0,0.00");
}

export const fPercent = (number: number) => {
    return numeral(number / 100).format("0.0%");
}

export const fNumber = (number: number) => {
    return numeral(number).format();
}

export const fNumberDecimal = (number: number, decimals: number = 1) => {
    return number !== undefined && number !== null
        ? numeral(number).format(`0.${'0'.repeat(decimals)}`)
        : number;
}

export const fData = (number: number) => {
    return numeral(number).format("0.0 b");
}

export const sprintf = (number: number, cant: number = 4, pos: string = "L", replace: string = "0") => {

    if (number || number === 0) {
        return pos === "L"
            ? number.toString().padStart(cant, replace)
            : number.toString().padEnd(cant, replace);
    } else return "";
};

