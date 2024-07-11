import React, { useState, useEffect } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY,findIdForUnitType, UnitType } from './Interfaces';
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
}

export const ListView = ({

    ...props
}: ListViewProps) => {

    const [tableDataType, setTableDataType] = React.useState("Task") //replace with something created in Interface

    //let fetchURL = "/api/" + tableDataType + "/";

    const handleClick = (item: Task | Milestone | Tag | Assignee) => {
        console.log("Inside List component - before invoking taskClick function " + item.name);
        props.rowClick(item);
    };


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
                        <button className='w-full h-[40px] bg-green-300 rounded-xl flex items-center p-4' onClick={() => handleClick(item)}>
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
                        <button className='w-full h-[50px] bg-green-300 rounded-xl flex items-center p-4' onClick={() => handleClick(item)}>
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

