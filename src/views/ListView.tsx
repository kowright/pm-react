import React from "react";
import { Assignee, Milestone, SortStates, Tag, Task, UnitDataType, ViewData } from '../utils/models';
import { filterMilestones, filterTasks, sortMilestones, sortTasks, } from "../utils/filterSorts";
import { findIdForUnitType } from "../utils/helpers";
import { colorSets } from "../utils/colors";
import FilterButton from "../components/FilterButton";
import { SortArea } from "../components/SortArea";
import AssigneeProfileImage from "../components/AssigneeProfile";

interface ListViewProps {
    milestoneData: Milestone[];
    tagData: Tag[];
    assigneeData: Assignee[];
    viewData: ViewData;
    listType: string;
}

export const ListView = ({
    viewData: { filterStates, selectedItem, taskData, unitClick, unitTypeData, setShowFilterAreaAssignees },
    listType = 'Task',
    ...props
}: ListViewProps) => {

    const [listDataType, setListDataType] = React.useState(listType);

    const [taskSortState, setTaskSortState] = React.useState<string[]>([]);
    const [milestoneSortState, setMilestoneSortState] = React.useState<string[]>([]);
    const [sortStates, setSortStates] = React.useState<SortStates>({
        taskSortState: taskSortState,
        milestoneSortState: milestoneSortState
    });

    React.useEffect(() => {
        if (listDataType === "Task") {
            setShowFilterAreaAssignees(true);
        }
        else {//milestones
            setShowFilterAreaAssignees(false);
        }
    }, [listDataType, setShowFilterAreaAssignees]);

    const handleClick = (item: UnitDataType) => {
        unitClick(item);
    };

    let filteredTasks: Task[] = [];
    let filteredMilestones: Milestone[] = [];

    //filters and sorts
    if (listDataType === 'Task') {
        filteredTasks = filterTasks(taskData, filterStates);
        
        filteredTasks = sortTasks(filteredTasks, sortStates);
    }
    else { //milestones
        filteredMilestones = filterMilestones(props.milestoneData, filterStates);

        filteredMilestones = sortMilestones(filteredMilestones, sortStates);
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
        <div className='flex flex-col flex-1 overflow-auto p-2 mb-4'>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setListDataType("Task")} active={listDataType === 'Task'} showX={false} />
                <FilterButton text='Milestone' onClick={() => setListDataType("Milestone")} active={listDataType === 'Milestone'} showX={false} />
            </div>

            <br />

            <SortArea unitOfSort={listDataType} sortState={sortStates} handleSort={handleSort} />

            <br />

            <div className='flex flex-col gap-4 overflow-y-auto overflow-visible p-2'>

                {listDataType === 'Task' &&
                    filteredTasks.map((item, index) => (
                        <button key={item.id} className={`w-full h-[40px] rounded-xl flex items-center p-4 ${color.focusRing} ${color.hover} focus:ring-offset-alabaster
                                    ${selectedItem?.type === findIdForUnitType('Task', unitTypeData) && selectedItem?.id === item.id ? color.selected: color.default}`}

                            onClick={() => handleClick(item)}>
                            <div className='w-auto'>{item.name}</div>
                            <div className='flex-1'>{item.description}</div>
                            <div className='w-auto flex justify-end items-center gap-x-2'>
                                {item.tags.map(tag =>
                                    <FilterButton key={tag.id} text={tag.name} colorByType='Tag'/>
                                )}
                                {item.roadmaps.map(map =>
                                    <FilterButton key={map.id} text={map.name} colorByType='Roadmap'/>
                                )}
                                <FilterButton text={item.taskStatus.name} colorByType='Task Status' />
                                <AssigneeProfileImage imageId={item.assignee.imageId} /> 
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

