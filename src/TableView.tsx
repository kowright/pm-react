import React, { useState, useEffect } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY, findIdForUnitType, UnitType, colorSets } from './Interfaces';
import { FilterButton } from './FilterButton'

interface TableViewProps {
 
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

export const TableView = ({
    ...props
}: TableViewProps) => {

    const [tableDataType, setTableDataType] = React.useState("Task");

    let content: any = <div>hi</div>;

    const handleClick = (item: Task | Milestone | Tag | Assignee ) => {
        console.log("Inside Timeline component - before invoking taskClick function " + item.name);
        props.rowClick(item); // Invoke the function with some example task data
    };

    let tableFormat: any;
    const formatHeaderLabel = (header: string): string => {
        //  Capitalize first letter and replace underscores with spaces
        return header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    };
    let headers: string[];

    const color = colorSets['blue']
    switch (tableDataType) {
        case "Task":

            /*if (!taskData || !taskData.message || taskData.message.length === 0) {
                return <p>No tasks found.</p>;
            }*/
            if (!props.taskData) {
                return <p>No tasks found.</p>
            }
    
           let filteredTasks = props.taskStatusFilterState && props.taskStatusFilterState.length > 0
                ? props.taskData.filter(task => props.taskStatusFilterState.includes(task.taskStatus.name))
                : props.taskData;


            filteredTasks = props.roadmapFilterState
                ? filteredTasks.filter(task => {
                    const taskRoadmapNames = task.roadmaps.map(map => map.name);
                    return props.roadmapFilterState.every(name => taskRoadmapNames.includes(name)); //AND
                    // return props.roadmapFilterState.some(name => taskRoadmapNames.includes(name)); //OR

                })
                : filteredTasks;
            console.log("task data ", props.taskData);

            headers = props.taskData.length > 0 ? Object.keys(props.taskData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));
            
            content =
                filteredTasks.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer ${color.hover}
                ${props.selectedItem?.type === findIdForUnitType('Task', props.unitTypeData) && props.selectedItem?.id === item.id ? color.default : 'bg-white text-smoky-black'}`}>
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
/*
            if (!milestoneData || !milestoneData.message || milestoneData.message.length === 0) {
                return <p>No milestones found.</p>;
            }*/
            if (!props.milestoneData) {
                return <p>No milestone found.</p>
            }

            headers = props.milestoneData.length > 0 ? Object.keys(props.milestoneData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));

            let filteredMilestones = props.taskStatusFilterState && props.taskStatusFilterState.length > 0
                ? props.milestoneData.filter(task => props.taskStatusFilterState.includes(task.taskStatus.name))
                : props.milestoneData;

            filteredMilestones = props.roadmapFilterState
                ? filteredMilestones.filter(ms => {
                    const milestoneRoadmapNames = ms.roadmaps.map(map => map.name);
                    return props.roadmapFilterState.every(name => milestoneRoadmapNames.includes(name)); //AND
                    // return props.roadmapFilterState.some(name => milestoneRoadmapNames.includes(name)); //OR

                })
                : filteredMilestones;
     
            content =
                filteredMilestones.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === findIdForUnitType('Milestone', props.unitTypeData) && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
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
            headers = props.tagData.length > 0 ? Object.keys(props.tagData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));

            content =
                props.tagData.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Tag' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
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

            headers = props.assigneeData.length > 0 ? Object.keys(props.assigneeData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));


            content =
                props.assigneeData.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item as Assignee)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Assignee' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
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


    //let filteredTasks = data.message;
  /*  let filteredTasks = selectedRoadmap
        ? data.message.filter(task => task.roadmaps.includes(selectedRoadmap))
        : data.message;

    filteredTasks = selectedTaskStatus
        ? filteredTasks.filter(task => task.taskStatus === selectedTaskStatus)
        : filteredTasks;*/

/*    switch (tableDataType) {
        case "tasks":
                
    
                content = 
               taskData.map((item, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>

                        <td className="border border-gray-300 px-4 py-2">{item.assignee.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.startDate))}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.endDate))}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
                    </tr >
                ));
            
            break;
        case "milestones":
       content = 
                milestoneData.map((item, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
                    </tr >
                ));
            console.log("milestones");
            break;
*//*        case "tags":
            filteredTasks = (filteredTasks as Tag[]);

            content = (
                filteredTasks.map((item, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    </tr >
                )))
            console.log("tags");
            break;
        case "assignees":
            filteredTasks = (filteredTasks as Assignee[]);

            content = (
                filteredTasks.map((item, index) => (
                    <tr key={index}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    </tr >
                )))
            console.log("assignees")
            break;*//*
        default:
            break;
    }
*/

    return (
        <div className='mx-8'>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setTableDataType("Task")} />
                <FilterButton text='Milestone' onClick={() => setTableDataType("Milestone")} /> 
           </div>
  
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


/*{
    filteredTasks.map((item, index) => (
        <tr key={index}>
            <td className="border border-gray-300 px-4 py-2">{item.name}</td>
            <td className="border border-gray-300 px-4 py-2">{item.description}</td>
            {*//* ADD BACK DURATION *//*}
            {*//*<td className="border border-gray-300 px-4 py-2">{item.roadmaps[0].}</td>*//*}
            <td className="border border-gray-300 px-4 py-2">{item.assignee.name}</td>
            <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.startDate))}</td>
            <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.endDate))}</td>
            <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
        </tr>
    ))
}*/


/*
switch (tableDataType) {
    case "tasks":

        break;
    case "milestones":
        console.log("milestones");
        break;
    case "tags":
        console.log("tags");
        break;
    case "assignees":
        console.log("assignees")
        break;
    default:
        break;

}
*/