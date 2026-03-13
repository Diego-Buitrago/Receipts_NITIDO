import { Tooltip } from "primereact/tooltip";
import { FC } from "react";
import { truncateText } from "../utils/others";

interface Props {
    text: string;
    classValue: string;
    maxLength?: number;
}

export const TooltipLongText: FC<Props> = ({ text, classValue, maxLength = 50 }) => {
    return (
        <div>
            <Tooltip target={`.${classValue}`} position="top" content={text} />
            <div className={classValue}>{truncateText(text, maxLength)}</div>
        </div>
    );
};