import React from "react";
import {
    Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, findIdForUnitType, UnitType, colorSets, FilterStates,
    UnitDataType, UnitDataTypeWithNull, ViewData, taskFilterOnTaskStatus, taskFilterOnRoadmap, taskSortByEarliestDate,
    milestoneFilterOnTaskStatus, milestoneFilterOnRoadmap, milestoneSortByEarliestDate, Unit, unitSortByNameAlphabetical, findUnitTypefromId
} from './Interfaces';
import { FilterButton } from './FilterButton';
import { SortArea } from './SortArea/SortArea';


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

    const [taskSortState, setTaskSortState] = React.useState<string[]>([]);
    const [milestoneSortState, setMilestoneSortState] = React.useState<string[]>([]);
    const [sortState, setSortStates] = React.useState({
        taskSortState: taskSortState,
        milestoneSortState: milestoneSortState
    });

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
        if (sortState.taskSortState.includes('EarliestStartDate')) {
            filteredTasks = taskSortByEarliestDate(filteredTasks, true);
        }
        if (sortState.taskSortState.includes("EarliestEndDate")) {
            filteredTasks = taskSortByEarliestDate(filteredTasks, false);
        }
        if (sortState.taskSortState.includes("Alphabetical")) {
            unitSortByNameAlphabetical(filteredTasks)
        }
      
    }
    else {
        //filtering
        filteredMilestones = milestoneFilterOnTaskStatus(props.milestoneData, filterStates.taskStatusFilterState);
        filteredMilestones = milestoneFilterOnRoadmap(filteredMilestones, filterStates.roadmapFilterState);

       //sorting
        if (sortState.milestoneSortState.includes('EarliestStartDate')) {
            filteredMilestones = milestoneSortByEarliestDate(filteredMilestones)
        }
        if (sortState.milestoneSortState.includes("Alphabetical")) {
            unitSortByNameAlphabetical(filteredMilestones)
        }
    }

    const color = colorSets['blueWhite'];

    const handleSort = (sort: string) => {
        if (listDataType === 'Task') {
            if (taskSortState.includes(sort)) {
                setTaskSortState([]);
                //this sort is already in
            } else {
                setTaskSortState([sort]);
                //other sort is in or there is no sort yet
            }
        } else { // milestones
            if (milestoneSortState.includes(sort)) {
                setMilestoneSortState([]);
            } else {
                setMilestoneSortState([sort]);
            }
        }
    };

    React.useEffect(() => {
        setSortStates({
            taskSortState: taskSortState,
            milestoneSortState: milestoneSortState
        });
    }, [milestoneSortState, taskSortState]);

    return (
        <div className=''>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setListDataType("Task")} active={listDataType === 'Task'} showX={false} />
                <FilterButton text='Milestone' onClick={() => setListDataType("Milestone")} active={listDataType === 'Milestone'} showX={false} />
            </div>

             <br/>
            <SortArea unitOfSort={listDataType} sortState={sortState} handleSort={handleSort} />
            <br />

            <div className='flex flex-col gap-4'>

                {listDataType === 'Task' &&
                    filteredTasks.map((item, index) => (
                        <button key={item.id} className={`w-full h-[40px] rounded-xl flex items-center p-4 ${color.focusRing} ${color.hover} focus:ring-offset-alabaster
                                    ${selectedItem?.type === findIdForUnitType('Task', unitTypeData) && selectedItem?.id === item.id ? color.selected: color.default}`}

                            onClick={() => handleClick(item)}>
                            <div className='w-auto'>{item.name}</div>
                            <div className='flex-1'>{item.description}</div>
                            <div className='w-auto flex justify-end gap-x-2'>
                                {item.tags.map(tag =>
                                    <FilterButton key={tag.id} text={tag.name} colorByType='Tag'/>
                                )}
                                {item.roadmaps.map(map =>
                                    <FilterButton key={map.id} text={map.name} colorByType='Roadmap'/>
                                )}
                                <FilterButton text={item.taskStatus.name} colorByType='Task Status' />


                            </div>
                        </button>
                    ))
                }

                {listDataType === 'Milestone' &&
                    filteredMilestones.map((item, index) => (
                        <button key={item.id} className={`w-full h-[40px] rounded-xl flex items-center p-4 ${color.focusRing} ${color.hover} 
                        ${selectedItem?.type === findIdForUnitType('Milestone', unitTypeData) && selectedItem?.id === item.id ?
                                color.default : 'bg-white text-smoky-black'} `}
                            onClick={() => handleClick(item)}>
                            <div className='w-auto'>{item.name}</div>
                            <div className='flex-1'>{item.description}</div>
                            <div className='w-auto flex justify-end gap-x-2'>
                                {item.tags.map(tag =>
                                    <FilterButton key={tag.id} text={tag.name} colorByType='Tag' />
                                )}
                                {item.roadmaps.map(map =>
                                    <FilterButton key={map.id} text={map.name} colorByType='Roadmap' />
                                )}
                                <FilterButton text={item.taskStatus.name} colorByType='Task Status' />


                            </div>
                        </button>
                    ))
                }
            </div>
        </div>
    );
}

export default ListView;

