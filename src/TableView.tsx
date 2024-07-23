import React from "react";
import {
    Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY, findIdForUnitType, UnitType,
    colorSets, ViewData, taskFilterOnTaskStatus, taskFilterOnRoadmap, taskSortByEarliestDate,
    milestoneFilterOnTaskStatus, milestoneFilterOnRoadmap, milestoneSortByEarliestDate, unitSortByNameAlphabetical, taskFilterOnTag, milestoneFilterOnTag
} from './Interfaces';
import { FilterButton } from './FilterButton';
import { SortArea } from './SortArea/SortArea';

interface TableViewProps {
 
    milestoneData: Milestone[];
    tagData: Tag[];
    assigneeData: Assignee[];
    viewData: ViewData;
}

export const TableView = ({
    viewData: { filterStates, selectedItem, taskData, unitClick, unitTypeData },
    ...props
}: TableViewProps) => {

    const [tableDataType, setTableDataType] = React.useState("Task");

    const [taskSortState, setTaskSortState] = React.useState<string[]>([]);
    const [milestoneSortState, setMilestoneSortState] = React.useState<string[]>([]);
    const [sortState, setSortStates] = React.useState({
        taskSortState: taskSortState,
        milestoneSortState: milestoneSortState
    });

    let content: any = <div>hi</div>;

    const handleClick = (item: Task | Milestone | Tag | Assignee ) => {
        unitClick(item); // Invoke the function with some example task data
    };

    let tableFormat: any;
    const formatHeaderLabel = (header: string): string => {
        return header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    };
    let headers: string[];

    const color = colorSets['blue'];

    const handleSort = (sort: string) => {
        if (tableDataType === 'Task') {
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


    switch (tableDataType) {
        case "Task":

            //filtering
            let filteredTasks = taskFilterOnTaskStatus(taskData, filterStates.taskStatusFilterState);
            filteredTasks = taskFilterOnRoadmap(filteredTasks, filterStates.roadmapFilterState);
            filteredTasks = taskFilterOnTag(filteredTasks, filterStates.tagFilterState);


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

            headers = taskData.length > 0 ? Object.keys(taskData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));
            
            content =
                filteredTasks.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer ${color.hover}
                ${selectedItem?.type === findIdForUnitType('Task', unitTypeData) && selectedItem?.id === item.id ? color.default : 'bg-white text-smoky-black'}`}>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.roadmaps.map((map, index) => (
                        index === item.roadmaps.length - 1 ? map.name : map.name + " | "
                    ))} </td>
                    <td className="border border-gray-300 px-4 py-2"> {item.tags.map((tag, index) => (
                        index === item.tags.length - 1 ? tag.name : tag.name + " | "
                    ))} </td>
                    <td className="border border-gray-300 px-4 py-2">{item.assignee.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.startDate))}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.endDate))}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.duration}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-4 py-2">Task</td>
                </tr >
            ));


            break;
        case "Milestone":

            if (!props.milestoneData) {
                return <p>No milestone found.</p>
            }

            headers = props.milestoneData.length > 0 ? Object.keys(props.milestoneData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));

            let filteredMilestones = milestoneFilterOnTaskStatus(props.milestoneData, filterStates.taskStatusFilterState);
            filteredMilestones = milestoneFilterOnRoadmap(filteredMilestones, filterStates.roadmapFilterState);
            filteredMilestones = milestoneFilterOnTag(filteredMilestones, filterStates.tagFilterState);

            if (sortState.milestoneSortState.includes('EarliestStartDate')) {
                filteredMilestones = milestoneSortByEarliestDate(filteredMilestones)
            }
            if (sortState.milestoneSortState.includes("Alphabetical")) {
                unitSortByNameAlphabetical(filteredMilestones)
            }

            content =
                filteredMilestones.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${selectedItem?.type === findIdForUnitType('Milestone', unitTypeData) && selectedItem?.id === item.id ? color.default : 'bg-white text-smoky-black'}`}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.roadmaps.map((map, index) => (
                            index === item.roadmaps.length - 1 ? map.name : map.name + " | "
                        ))} </td>
                        <td className="border border-gray-300 px-4 py-2"> {item.tags.map((tag, index) => (
                            index === item.tags.length - 1 ? tag.name : tag.name + " | "
                        ))} </td>
             
                        <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.date))}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                     
                        <td className="border border-gray-300 px-4 py-2">Milestone</td>
                    </tr >
                ));
            break;
/*        case "Tag":
           *//* if (!tagData || !tagData.message || tagData.message.length === 0) {
                return <p>No tags found.</p>;
            }
*//*
            headers = tagData.length > 0 ? Object.keys(tagData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));

            content =
                tagData.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${selectedItem?.type === 'Tag' && selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
                        <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">Tag</td>
                    </tr >
                ));
            break;
        case "Assignee":
          *//*  if (!assigneeData || !assigneeData.message || assigneeData.message.length === 0) {
                return <p>No assignees found.</p>;
            }*//*

            headers = assigneeData.length > 0 ? Object.keys(assigneeData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));


            content =
                assigneeData.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item as Assignee)} className={`cursor-pointer hover:bg-lime-500
                ${selectedItem?.type === 'Assignee' && selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
                        <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">Assignee</td>
                    </tr >
                ));
            break;*/
        default:
            break;
    }

    return (
        <div className=''>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setTableDataType("Task")} active={tableDataType === 'Task'} showX={false} />
                <FilterButton text='Milestone' onClick={() => setTableDataType("Milestone")} active={tableDataType === 'Milestone'} showX={false} />
           </div>
  
            <br />
            <SortArea unitOfSort={tableDataType} sortState={sortState} handleSort={handleSort} />

            <br />

            <table className="min-w-full text-white border-collapse border border-gray-200">
                <thead className={`${color.selected}`}>
                    <tr>
                        {tableFormat}
                    </tr>
                </thead>
                <tbody>
                    {content}
                </tbody>
            </table>

          
        </div>
    );
}

export default TableView;