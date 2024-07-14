import React, { useEffect, useState } from "react";
import {
    Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY, formatDateWords,
    findIdForUnitType, colorSets, ViewData, taskFilterOnTaskStatus, taskFilterOnRoadmap, taskSortByEarliestDate,
    milestoneFilterOnTaskStatus, milestoneFilterOnRoadmap, milestoneSortByEarliestDate
} from './Interfaces';
import { FilterButton } from './FilterButton';

interface KanbanViewProps {
    milestoneData: Milestone[];
    viewData: ViewData;
}

export const KanbanView = ({
    viewData: { filterStates, selectedItem, taskData, unitClick, unitTypeData },
        ...props
    }: KanbanViewProps) => {

     const [kanbanDataType, setKanbanDataType] = React.useState("Task");

     const handleClick = (task: Task | Milestone | Tag | Assignee) => {
         unitClick(task); 
     };

     let filteredTasks = taskData;
    let filteredMilestones = props.milestoneData;
    let statusColumns;
     const color = colorSets['blueWhite'];

    let tasksByTaskStatus: Record<string, Task[]>;
    let tasksByMilestoneStatus: Record <string, Milestone[]>;

    if (kanbanDataType === 'Task') {
        //filtering
        filteredTasks = taskFilterOnTaskStatus(taskData, filterStates.taskStatusFilterState);
        filteredTasks = taskFilterOnRoadmap(filteredTasks, filterStates.roadmapFilterState);

       tasksByTaskStatus = filteredTasks.reduce((acc: Record<string, Task[]>, task: Task) => {
            const status = task.taskStatus.name;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(task);
            return acc;
        }, {});

        statusColumns = Object.keys(tasksByTaskStatus).map(key =>
            tasksByTaskStatus[key]?.map((task, index) => (
                <div key={task.id} onClick={() => handleClick(task)} className={`cursor-pointer relative ${color.focusRing} ${color.hover} rounded-xl flex flex-col justify-center w-[320px] gap-1 p-2
               ${selectedItem?.id === task.id ? color.selected : color.default} `}>
                    <div className='absolute right-0 top-0 mt-2 mr-2'>
                        <img className='ml-2 w-[34px] rounded-full' src="https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg" alt="Doggo" />
                    </div>

                    <div className='text-lg font-bold'> {task.name}</div>
                    <div className='text-sm'>{task.description}</div>
                    <div className='text-sm'>{formatDateWords(new Date(task.startDate))} - {formatDateWords(new Date(task.endDate))}</div>
                    <div className='w-auto flex justify-start gap-x-2'>
                        {task.tags.map(tag =>
                            <FilterButton text={tag.name} />
                        )}
                        {task.roadmaps.map(map =>
                            <FilterButton text={map.name} />
                        )}
                    </div>
                </div>
            )));
    } else {
        //filtering
        filteredMilestones = milestoneFilterOnTaskStatus(props.milestoneData, filterStates.taskStatusFilterState);
        filteredMilestones = milestoneFilterOnRoadmap(filteredMilestones, filterStates.roadmapFilterState);

        tasksByMilestoneStatus = filteredMilestones.reduce((acc: Record<string, Milestone[]>, ms: Milestone) => {
            const status = ms.taskStatus.name;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(ms);
            return acc;
        }, {});

        statusColumns = Object.keys(tasksByMilestoneStatus).map(key =>
            tasksByMilestoneStatus[key]?.map((ms, index) => (
                <div key={ms.id} onClick={() => handleClick(ms)} className={`cursor-pointer relative ${color.focusRing} ${color.hover} rounded-xl flex flex-col justify-center w-[320px] gap-1 p-2
               ${selectedItem?.id === ms.id ? color.selected : color.default} `}>
                    <div className='absolute right-0 top-0 mt-2 mr-2'>
                        <img className='ml-2 w-[34px] rounded-full' src="https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg" alt="Doggo" />
                    </div>

                    <div className='text-lg font-bold'> {ms.name}</div>
                    <div className='text-sm'>{ms.description}</div>
                    <div className='text-sm'>{formatDateWords(new Date(ms.date))}</div>
                    <div className='w-auto flex justify-start gap-x-2'>
                        {ms.tags.map(tag =>
                            <FilterButton text={tag.name} />
                        )}
                        {ms.roadmaps.map(map =>
                            <FilterButton text={map.name} />
                        )}
                    </div>
                </div>
            )));
    }
   

    return (
        <div className=''>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setKanbanDataType("Task")} active={kanbanDataType === 'Task'} showX={false} />
                <FilterButton text='Milestone' onClick={() => setKanbanDataType("Milestone")} active={kanbanDataType === 'Milestone'} showX={false} />
            </div>
            <br/>
            <div className='flex gap-4'>
                <div className='flex gap-4'>
                    {kanbanDataType === 'Task' && statusColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col space-y-4">
                            <h1 className="text-xl text-smoky-black text-center font-bold">{Object.keys(tasksByTaskStatus)[columnIndex]}</h1>
                            {column}
                        </div>
                    ))}
                    {kanbanDataType === 'Milestone' && statusColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col space-y-4">
                            <h1 className="text-xl text-smoky-black text-center font-bold">{Object.keys(tasksByMilestoneStatus)[columnIndex]}</h1>
                            {column}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KanbanView;
