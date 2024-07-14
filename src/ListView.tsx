import React from "react";
import {
    Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, findIdForUnitType, UnitType, colorSets, FilterStates,
    UnitDataType, UnitDataTypeWithNull, ViewData, taskFilterOnTaskStatus, taskFilterOnRoadmap, taskSortByEarliestDate,
    milestoneFilterOnTaskStatus, milestoneFilterOnRoadmap, milestoneSortByEarliestDate
} from './Interfaces';
import { FilterButton } from './FilterButton'

interface ListViewProps {
    milestoneData: Milestone[];
    tagData: Tag[];
    assigneeData: Assignee[];
    viewData: ViewData;
}

export const ListView = ({
    viewData: { filterStates, selectedItem, taskData, unitClick, unitTypeData},
    ...props
}: ListViewProps) => {

    const [listDataType, setListDataType] = React.useState("Task");

    const handleClick = (item: UnitDataType) => {
        unitClick(item);
    };

    let filteredTasks: Task[] = [];
    let filteredMilestones: Milestone[] = [];

    if (listDataType === 'Task') {
        //filtering
        filteredTasks = taskFilterOnTaskStatus(taskData, filterStates.taskStatusFilterState);
        filteredTasks = taskFilterOnRoadmap(filteredTasks, filterStates.roadmapFilterState);

        //sorting
        //filteredTasks = taskSortByEarliestDate(filteredTasks, true);
    }
    else {
        //filtering
        filteredMilestones = milestoneFilterOnTaskStatus(props.milestoneData, filterStates.taskStatusFilterState);
        filteredMilestones = milestoneFilterOnRoadmap(filteredMilestones, filterStates.roadmapFilterState);

       //sorting
        //filteredMilestones = milestoneSortByEarliestDate(filteredMilestones)
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
                        ${selectedItem?.type === findIdForUnitType('Task', unitTypeData) && selectedItem?.id === item.id ? 
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
                        ${selectedItem?.type === findIdForUnitType('Milestone', unitTypeData) && selectedItem?.id === item.id ?
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

