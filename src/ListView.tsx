import React, { useState, useEffect } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY,findIdForUnitType, UnitType, colorSets } from './Interfaces';
import { FilterButton } from './FilterButton'

interface ListViewProps {
    roadmap: Roadmap | null; //group filter properties together
    taskStatus: TaskStatus | null;
    taskData: Task[];
    milestoneData: Milestone[];
    tagData: Tag[];
    assigneeData: Assignee[];
    rowClick: (task: Task | Milestone | Tag | Assignee) => void;
    selectedItem: Task | Milestone | Tag | Assignee | null;
    unitTypeData: UnitType[];
    roadmapFilterState: string[];
    taskStatusFilterState: string[];
}

export const ListView = ({

    ...props
}: ListViewProps) => {

    const [listDataType, setListDataType] = React.useState("Task");

    const handleClick = (item: Task | Milestone | Tag | Assignee) => {
        console.log("Inside List component - before invoking taskClick function " + item.name);
        props.rowClick(item);
    };

    let filteredTasks: Task[] = [];
    let filteredMilestones: Milestone[] = [];

    if (listDataType === 'Task') {
        filteredTasks = props.taskStatusFilterState && props.taskStatusFilterState.length > 0
            ? props.taskData.filter(task => props.taskStatusFilterState.includes(task.taskStatus.name))
            : props.taskData;


        filteredTasks = props.roadmapFilterState
            ? filteredTasks.filter(task => {
                const taskRoadmapNames = task.roadmaps.map(map => map.name);
                return props.roadmapFilterState.every(name => taskRoadmapNames.includes(name)); //AND
               // return props.roadmapFilterState.some(name => taskRoadmapNames.includes(name)); //OR

            })
            : filteredTasks;
    }
    else {
        filteredMilestones = props.taskStatusFilterState && props.taskStatusFilterState.length > 0
            ? props.milestoneData.filter(task => props.taskStatusFilterState.includes(task.taskStatus.name))
            : props.milestoneData;

        filteredMilestones = props.roadmap
            ? filteredMilestones.filter(ms => {
                const milestoneRoadmapNames = ms.roadmaps.map(map => map.name);
                return props.roadmapFilterState.every(name => milestoneRoadmapNames.includes(name)); //AND
                // return props.roadmapFilterState.some(name => milestoneRoadmapNames.includes(name)); //OR

            })
            : filteredMilestones;
    }

    const color = colorSets['blue'];

    return (
        <div className=''>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setListDataType("Task")} active={listDataType === 'Task'} showX={false} />
                <FilterButton text='Milestone' onClick={() => setListDataType("Milestone")} active={listDataType === 'Milestone'} showX={false} />
            </div>

            <br />

            <div className='flex flex-col gap-4'>

                {listDataType === 'Task' &&
                    filteredTasks.map((item, index) => (
                        <button className={`w-full h-[40px] rounded-xl flex items-center p-4 ${color.focusRing} ${color.hover} focus:ring-offset-alabaster
                        ${props.selectedItem?.type === findIdForUnitType('Task', props.unitTypeData) && props.selectedItem?.id === item.id ? 
                            color.default : 'bg-white text-smoky-black'} `}
                            onClick={() => handleClick(item)}>
                            <div className='w-auto'>{item.name}</div>
                            <div className='flex-1'>{item.description}</div>
                            <div className='w-auto flex justify-end gap-x-2'>
                                {item.tags.map(tag =>
                                    <FilterButton text={tag.name} onClick={() => console.log("eng")} />
                                )}
                                {item.roadmaps.map(map =>
                                    <FilterButton text={map.name} onClick={() => console.log("eng")} />
                                )}
                                <FilterButton text={item.taskStatus.name} onClick={() => console.log("eng")} />


                            </div>
                        </button>
                    ))
                }

                {listDataType === 'Milestone' &&
                    filteredMilestones.map((item, index) => (
                        <button className={`w-full h-[40px] rounded-xl flex items-center p-4 ${color.focusRing} ${color.hover} focus:ring-offset-alabaster
                        ${props.selectedItem?.type === findIdForUnitType('Milestone', props.unitTypeData) && props.selectedItem?.id === item.id ?
                                color.default : 'bg-white text-smoky-black'} `}
                            onClick={() => handleClick(item)}>
                            <div className='w-auto'>{item.name}</div>
                            <div className='flex-1'>{item.description}</div>
                            <div className='w-auto flex justify-end gap-x-2'>
                                {item.tags.map(tag =>
                                    <FilterButton text={tag.name} onClick={() => console.log("eng")} />
                                )}
                                {item.roadmaps.map(map =>
                                    <FilterButton text={map.name} onClick={() => console.log("eng")} />
                                )}
                                <FilterButton text={item.taskStatus.name} onClick={() => console.log("eng")} />


                            </div>
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default ListView;

