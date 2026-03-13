import { FC, FocusEvent } from "react";
// UI
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Calendar } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
// UTILS
import { propsCalendar, propsSelect } from "../utils/defaultProps";
import { FloatLabel } from "primereact/floatlabel";

const defaultClass = "grid grid-cols-4 gap-5 mt-2";

const defaultStyle =  { width: '50%' };

interface Props {
    refFilters: any;
    filters: object[];
    setFilters: (filters: any) => void;
    style?: object;
    className?: string
}

export const FiltersComponent: FC<Props> = ({ refFilters, filters, setFilters, className = defaultClass, style = defaultStyle }) => {

    const onBlur = (event: FocusEvent<HTMLInputElement, Element>, key: string) => {
        const { value } = event.target;
        setFilters((prev: any) => ({ ...prev, [key]: value }));
    };

    const handleKeyUp = (event: any, key: string) => {
        if (event.keyCode === 13) {
            const { value } = event.target;
            setFilters((prev: any) => ({ ...prev, [key]: value }));
        }
    };

    return (
        <OverlayPanel ref={refFilters} style={style}>
            <div className={className}>
                {filters.map((filter: any, index: number) => (
                    <div key={index} className={filter?.className || ""}>
                        <FloatLabel>
                            {
                                filter.type === "dropdown" && (
                                    <Dropdown
                                        {...propsSelect}
                                        {...filter.props}
                                        className="w-full"
                                        onChange={(e) => setFilters((prev: any) => ({ ...prev, [filter.key]: e.value || null }))}
                                    />
                                )
                            }
                            {
                                filter.type === "input" && (
                                    <InputText 
                                        {...filter.props}
                                           className="w-full"
                                        onBlur={(event) => onBlur(event, filter.key)} 
                                        onKeyUp={(event) => handleKeyUp(event, filter.key)} 
                                    />
                                )
                            }
                            {filter.type === "calendar" && (
                                <Calendar
                                    {...propsCalendar}
                                    selectionMode="range"
                                       className="w-full"
                                    {...filter.props}
                                    onChange={(e) => setFilters((prev: any) => ({ ...prev, [filter.key]: e.value || [] }))}
                                />
                            )}
                            <label>{filter.label}</label>
                        </FloatLabel>
                    </div>
                ))}
            </div>
        </OverlayPanel>
    )
}
