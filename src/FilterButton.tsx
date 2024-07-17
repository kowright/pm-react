import React from "react";
import { Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY, colorSets } from './Interfaces';

export interface FilterButtonProps {
    text: string;
    /**
     * Not giving a click handler will make the button not have a hover state so it won't look like it's clickable
     */
    onClick?: () => void;
    active?: boolean;
    showX?: boolean;
    /**
     * Optional: Object defining color pallete, options: red, orange, yellow, blue, purple, pink
     */
    useColorSet?: keyof typeof colorSets;
    backgroundColor?: string
    /**
     * Should be like Tag, Assignee etc. 
    */
    colorByType?: string;
}

export const FilterButton = ({
    active = false,
    showX = true,
    useColorSet = 'blueLite',
    backgroundColor = 'alabaster',
    ...props
}: FilterButtonProps) => {


    if (props.colorByType) {
        if (props.colorByType === 'Tag') {
            useColorSet = 'purple'
        }
        else if (props.colorByType === 'Assignee') {
            useColorSet = 'yellow'
        }
        else if (props.colorByType === 'Roadmap') {
            useColorSet = 'orange'
        }
        else if (props.colorByType === 'Task Status') {
            useColorSet = 'pink'
        }
    }

    const hoverOn = props.onClick ? true : false;

    const color = colorSets[useColorSet];
    const offsetColor = 'focus:ring-offset-' + backgroundColor;
    return (
        <button className={`h-[25px] w-fit rounded-lg flex justify-center items-center shrink-0 p-2 ${offsetColor}
        ${active ? color.selected : color.default} ${hoverOn && color.hover} ${color.focusRing} `} onClick={props.onClick && props.onClick}>
            {props.text}
            {showX && active && <div className='ml-2 flex items-center'>X</div>}
        </button>
    );
};
export default FilterButton;
