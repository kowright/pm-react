import React, { useState, useEffect } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY } from './Interfaces';

interface TableViewProps {
    roadmap: Roadmap | null; //group filter properties together
    taskStatus: TaskStatus | null;
    taskData: Task[];
    milestoneData: Milestone[];
    tagData: Tag[];
    assigneeData: Assignee[];
    rowClick: (task: Task | Milestone | Tag | Assignee) => void;
    selectedItem: Task | Milestone | Tag | Assignee | null;
}

export const TableView = ({

    ...props
}: TableViewProps) => {
    //const [taskData, setTaskData] = useState<{ message: Task[] } | null>(null);
    //const [milestoneData1, setMilestoneData] = useState<{ message: Milestone[] } | null>(null);
   // const [tagData, setTagData] = useState<{ message: Tag[] } | null>(null);
    //const [assigneeData, setAssigneeData] = useState<{ message: Assignee[] } | null>(null);

    const [tableDataType, setTableDataType] = React.useState("Task") //replace with something created in Interface

    //let fetchURL = "/api/" + tableDataType + "/";
    let content: any = <div>hi</div>;

    const handleClick = (item: Task | Milestone | Tag | Assignee ) => {
        console.log("Inside Timeline component - before invoking taskClick function " + item.name);
        props.rowClick(item); // Invoke the function with some example task data
    };
/*
    useEffect(() => {
        switch (tableDataType) {
           *//* case "tasks":
                fetch(fetchURL)
                    .then((res) => res.json())
                    .then((data) => setTaskData(data));
                break;*//*
            case "milestones":
                fetch(fetchURL)
                    .then((res) => res.json())
                    .then((data) => setMilestoneData(data));
                console.log("milestones");
                break;
            case "tags":
                fetch(fetchURL)
                    .then((res) => res.json())
                    .then((data) => setTagData(data));
                console.log("tags");
                break;
            case "assignees":
                fetch(fetchURL)
                    .then((res) => res.json())
                    .then((data) => setAssigneeData(data));
                console.log("assignees")
                break;
            default:
                break;
        }
    }, [fetchURL, tableDataType]);
*/

/*    switch (tableDataType) {
        case "tasks":
            if (!taskData) {
                return <p>Loading...!</p>; // Render loading until data is fetched   
            }
            break;
        case "milestones":
            if (!milestoneData) {
                return <p>Loading...!</p>; // Render loading until data is fetched   
            }
            break;
        case "tags":
            if (!tagData) {
                return <p>Loading...!</p>; // Render loading until data is fetched   
            }
            break;
        case "assignees":
            if (!assigneeData) {
                return <p>Loading...!</p>; // Render loading until data is fetched   
            }
            break;
        default:
            break;
    }
*/
    let tableFormat: any;
    const formatHeaderLabel = (header: string): string => {
        // Example: Capitalize first letter and replace underscores with spaces
        return header.charAt(0).toUpperCase() + header.slice(1).replace(/_/g, ' ');
    };
    let headers: string[];

    switch (tableDataType) {
        case "Task":

            /*if (!taskData || !taskData.message || taskData.message.length === 0) {
                return <p>No tasks found.</p>;
            }*/
            
            if (props.roadmap) {
                console.log("task " + props.roadmap.name)
            }

            let filteredTasks = props.taskStatus
                ? props.taskData.filter(task => task.taskStatus.name === props.taskStatus!.name)
                : props.taskData;

            filteredTasks = props.roadmap
                ? filteredTasks.filter(task => {
                    const roadmaps = task.roadmaps.map(map => map.name);
                    return roadmaps.includes(props.roadmap!.name);
                })
                : filteredTasks;

            headers = props.taskData.length > 0 ? Object.keys(props.taskData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));
            
            content = 
            filteredTasks.map((item, index) => (
                <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Task' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
                    <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.roadmaps.map(map => map.name + " ")}</td>

                    <td className="border border-gray-300 px-4 py-2">{item.assignee.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.startDate))}</td>
                    <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.endDate))}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.duration}</td>

                    <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                    <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                </tr >
            ));
            break;
        case "Milestone":
/*
            if (!milestoneData || !milestoneData.message || milestoneData.message.length === 0) {
                return <p>No milestones found.</p>;
            }*/

            headers = props.milestoneData.length > 0 ? Object.keys(props.milestoneData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));

            let filteredMilestones = props.taskStatus
                ? props.milestoneData.filter(milestone => milestone.taskStatus.name === props.taskStatus!.name)
                : props.milestoneData;
     
            content =
                filteredMilestones.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Milestone' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">{formatDateNumericalMMDDYYYY(new Date(item.date))}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.taskStatus.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                    </tr >
                ));
            break;
        case "Tag":
           /* if (!tagData || !tagData.message || tagData.message.length === 0) {
                return <p>No tags found.</p>;
            }
*/
            headers = props.tagData.length > 0 ? Object.keys(props.tagData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));

            content =
                props.tagData.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Tag' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                    </tr >
                ));
            break;
        case "Assignee":
          /*  if (!assigneeData || !assigneeData.message || assigneeData.message.length === 0) {
                return <p>No assignees found.</p>;
            }*/

            headers = props.assigneeData.length > 0 ? Object.keys(props.assigneeData[0]) : [];

            tableFormat =
                headers.map((header, index) => (
                    <th key={index} className="border border-gray-300 px-4 py-2">{formatHeaderLabel(header)}</th>
                ));


            content =
                props.assigneeData.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item as Assignee)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Assignee' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
                        <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.id}</td>
                        <td className="border border-gray-300 px-4 py-2">{item.type}</td>
                    </tr >
                ));
            break;
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
            <p className='flex justify-center text-3xl text-white'>TABLE VIEW</p>
            <div className='flex gap-4 justify-center'>
                <button className={`rounded border border-cyan-200 p-2 ${tableDataType === "tasks" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => setTableDataType("Task")}>Task</button>
                <button className={`rounded border border-cyan-200 p-2 ${tableDataType === "milestones" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => setTableDataType("Milestone")}>Milestone</button>
                <button className={`rounded border border-cyan-200 p-2 ${tableDataType === "tags" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => setTableDataType("Tag")}>Tag</button>
                <button className={`rounded border border-cyan-200 p-2 ${tableDataType === "assignees" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => setTableDataType("Assignee")}>Assignee</button>
           </div>
  
            <br />
            <table className="min-w-full text-white border-collapse border border-gray-200">
                <thead className="bg-gray-600">
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