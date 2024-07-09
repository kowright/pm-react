import React, { useState, useEffect } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY } from './Interfaces';
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
}

export const ListView = ({

    ...props
}: ListViewProps) => {
    //const [taskData, setTaskData] = useState<{ message: Task[] } | null>(null);
    //const [milestoneData1, setMilestoneData] = useState<{ message: Milestone[] } | null>(null);
    // const [tagData, setTagData] = useState<{ message: Tag[] } | null>(null);
    //const [assigneeData, setAssigneeData] = useState<{ message: Assignee[] } | null>(null);

    const [tableDataType, setTableDataType] = React.useState("Task") //replace with something created in Interface

    //let fetchURL = "/api/" + tableDataType + "/";
    let content: any = <div>hi</div>;

    const handleClick = (item: Task | Milestone | Tag | Assignee) => {
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
            if (!props.taskData) {
                return <p>No tasks found.</p>
            }
            console.log("props task data", props.taskData)
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
            console.log("task data ", props.taskData);

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

            let filteredMilestones = props.taskStatus
                ? props.milestoneData.filter(milestone => milestone.taskStatus.name === props.taskStatus!.name)
                : props.milestoneData;

            content =
                filteredMilestones.map((item, index) => (
                    <tr key={index} onClick={() => handleClick(item)} className={`cursor-pointer hover:bg-lime-500
                ${props.selectedItem?.type === 'Milestone' && props.selectedItem?.id === item.id ? 'bg-lime-800' : ''}`}>
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

            <div className='flex flex-col gap-4'>

                {tableDataType === 'Task' &&
                    props.taskData.map((item, index) => (
                        <button className='w-full h-[50px] bg-green-300 rounded-xl flex items-center p-4'>
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

                {tableDataType === 'Milestone' &&
                    props.milestoneData.map((item, index) => (
                        <button className='w-full h-[50px] bg-green-300 rounded-xl flex items-center p-4'>
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

