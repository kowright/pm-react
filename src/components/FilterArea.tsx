import React from 'react';
import { Assignee, FilterStates, Roadmap, Tag, TaskStatus, Unit, UnitType } from "../utils/models";
import { findUnitTypefromId } from "../utils/helpers";
import { colorSets, getUnitColorSetName } from '../utils/colors';

interface FilterAreaProps {
    roadmapData: Roadmap[];
    taskStatusData: TaskStatus[];
    tagData: Tag[];
    assigneeData: Assignee[];
    unitTypeData: UnitType[]; 
    handleFilterByRoadmap: (roadmap: Roadmap) => void; 
    handleFilterByTaskStatus: (taskStatus: TaskStatus) => void;
    handleFilterByTag: (tag: Tag) => void;
    handleFilterByAssignee: (assignee: Assignee) => void;
    filterStates: FilterStates;
    showAssignees: boolean;
}

export const FilterArea = ({
    showAssignees = true,
    ...props
}: FilterAreaProps) => {

    if (!props.taskStatusData || !props.roadmapData) {
        return <div> oh no dude</div>
    };

    const PMButton = (item: Unit) => {
        let color = colorSets['green'];
        let filterFunction: () => void; 
        let filterShowX;
        let filterColor;

        if (findUnitTypefromId(item.type, props.unitTypeData) === 'Roadmap') {
            color = colorSets[getUnitColorSetName('Roadmap')];

            filterColor = props.filterStates.roadmapFilterState.includes(item.name) ? `${color.selected} opacity-100` : `${color.default} opacity-50`
            filterFunction = () => props.handleFilterByRoadmap(item as Roadmap);
            filterShowX = props.filterStates.roadmapFilterState.includes(item.name) && <div className='ml-2 flex items-center'>X</div>
        }
        else if (findUnitTypefromId(item.type, props.unitTypeData) === 'Task Status') {
            color = colorSets[getUnitColorSetName('Task Status')];
            
            filterColor = props.filterStates.taskStatusFilterState.includes(item.name) ? `${color.selected} opacity-100` : `${color.default} opacity-50`
            filterFunction = () => props.handleFilterByTaskStatus(item as TaskStatus);
            filterShowX = props.filterStates.taskStatusFilterState.includes(item.name) && <div className='ml-2 flex items-center'>X</div>
        }
        else if (findUnitTypefromId(item.type, props.unitTypeData) === 'Tag') {
            color = colorSets[getUnitColorSetName('Tag')];

            filterColor = props.filterStates.tagFilterState.includes(item.name) ? `${color.selected} opacity-100` : `${color.default} opacity-50` 
            filterFunction = () => props.handleFilterByTag(item as Tag);
            filterShowX = props.filterStates.tagFilterState.includes(item.name) && <div className='ml-2 flex items-center'>X</div>
        }
        else if (findUnitTypefromId(item.type, props.unitTypeData) === 'Assignee') {
            color = colorSets[getUnitColorSetName('Assignee')];

            filterColor = props.filterStates.assigneeFilterState.includes(item.name) ? `${color.selected} opacity-100` : `${color.default} opacity-50`
            filterFunction = () => props.handleFilterByAssignee(item as Assignee);
            filterShowX = props.filterStates.assigneeFilterState.includes(item.name) && <div className='ml-2 flex items-center'>X</div>
        }

        return (
            <button key={item.id}
                className={`h-[25px] w-fit bg-ash-gray rounded-lg flex justify-center items-center shrink-0 p-2 ${color.hover} ${color.focusRing} focus:ring-offset-alabaster ${filterColor}`}
                onClick={() => filterFunction()}
            >
                {item.name}
                {filterShowX}
            </button>
        );
    };

    const pmRoadmapButtons = props.roadmapData.map(roadmap =>
        PMButton(roadmap)
    );

    const pmTaskStatusButtons = props.taskStatusData.map(status => 
        PMButton(status)
    );

    const pmTagButtons = props.tagData?.map(tag =>
        PMButton(tag)
    );

    const pmAssigneeButtons = props.assigneeData?.map(as =>
        PMButton(as)
    );

    return (
        <div className='flex gap-x-4 gap-y-2 flex-wrap'>
            {pmRoadmapButtons}
            {pmTaskStatusButtons}
            {pmTagButtons}
            {showAssignees && pmAssigneeButtons}
        </div>
    );
};


