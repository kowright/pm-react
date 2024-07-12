import React from "react";
import { Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY, colorSets } from './Interfaces';

export interface FilterButtonProps {
    text: string;
    onClick: () => void;
    active?: boolean;
    showX?: boolean;
    /**
     * Optional: Object defining color pallete 
     */
    useColorSet?:keyof typeof colorSets;
}

export const FilterButton = ({
    active = false,
    showX = true,
    useColorSet = 'blue',
    ...props
}: FilterButtonProps) => {
    const color = colorSets[useColorSet];

    return (
        <button className={`h-[25px] w-fit rounded-lg flex justify-center items-center shrink-0 p-2
        ${active ? color.selected : color.default} ${color.hover} ${color.focusRing} `} onClick={props.onClick}>
            {props.text}
            {showX && active && <div className='ml-2 flex items-center'>X</div>}
        </button>
    );
};
export default FilterButton;
