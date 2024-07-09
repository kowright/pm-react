import React from "react";
import { Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY } from './Interfaces';

export interface FilterButtonProps {
    text: string;
    onClick: () => void;
}

export const FilterButton = ({
    ...props
}: FilterButtonProps) => {

    return (
        <button className='h-[25px] w-fit bg-yellow-500 rounded-lg flex justify-center items-center text-white shrink-0 p-2' onClick={props.onClick} >
            {props.text}
        </button>
    );
};
export default FilterButton;
