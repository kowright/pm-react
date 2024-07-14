import React, { useEffect, useState } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY, formatDateWords, findIdForUnitType, colorSets } from './Interfaces';
import { FilterButton } from './FilterButton';

interface KanbanViewProps {
    //give unitTypes
    rowClick: (task: Task | Milestone | Tag | Assignee) => void;
    taskData: Task[];
    selectedItem: Task | Milestone | Tag | Assignee | null;
    roadmapFilterState: string[];
    taskStatusFilterState: string[];
}

 export const KanbanView = ({
        ...props
    }: KanbanViewProps) => {


    const [taskData, setTaskData] = useState<{ message: Task[] } | null>(null);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null> (null); //keep
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null); //keep
    const [roadmapData, setRoadmapData] = useState<{ message: Roadmap[] } | null>(null);
    const [taskStatusData, setTaskStatusData] = useState<{ message: TaskStatus[] } | null>(null);

     const handleClick = (task: Task | Milestone | Tag | Assignee) => {
         props.rowClick(task); 
     };

     useEffect(() => {
         fetch("/api/roadmaps")
             .then((res) => res.json())
             .then((data) => setRoadmapData(data))
             .catch((error) => console.error('Error fetching data:', error));
     }, []);

     useEffect(() => {
         fetch("/api/taskstatus")
             .then((res) => res.json())
             .then((data) => setTaskStatusData(data))
             .catch((error) => console.error('Error fetching data:', error));
     }, []);
/*
    if (!taskData || !roadmapData || !taskStatusData) {
        return <div> oh no</div>
    }*/

     let filteredTasks = props.taskData;

     const color = colorSets['blue'];
    
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

    const tasksByStatus = filteredTasks.reduce((acc: Record<string, Task[]>, task: Task) => {
        const status = task.taskStatus.name;
        if (!acc[status]) {
            acc[status] = [];
        }
        acc[status].push(task);
        return acc;
    }, {});

     let statusColumns = Object.keys(tasksByStatus).map(key =>
         tasksByStatus[key]?.map((task, index) => (
             <div key={task.id} onClick={() => handleClick(task)} className={`cursor-pointer relative ${color.focusRing} ${color.focusRing} rounded-xl flex flex-col justify-center w-[320px] gap-1 p-2
               ${props.selectedItem?.id === task.id ? color.default : 'bg-white text-smoky-black'} `}>
                 <div className='absolute right-0 top-0 mt-2 mr-2'>
                     <img className='ml-2 w-[34px] rounded-full' src="https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg" alt="Doggo" />
                 </div>

                 <div className='text-lg font-bold'> {task.name}</div>
                 <div className='text-sm'>{task.description}</div>
                 <div className='text-sm'>{formatDateWords(new Date (task.startDate))} - {formatDateWords( new Date(task.endDate))}</div>
                 <div className='w-auto flex justify-start gap-x-2'>
                     {task.tags.map(tag =>
                         <FilterButton text={tag.name}/>
                     )}
                     {task.roadmaps.map(map =>
                         <FilterButton text={map.name}/>
                     )}
                 </div>
             </div>
         )));

    return (
        <div className=''>
            <br/>
            <div className='flex gap-4'>
                <div className='flex gap-4'>
                    {statusColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col space-y-4">
                            <h1 className="text-xl text-smoky-black text-center font-bold">{Object.keys(tasksByStatus)[columnIndex]}</h1>
                            {column}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KanbanView;


/*return (
    <div>
        <br />
        <p className='flex justify-center text-3xl text-white'>KANBAN VIEW</p>
        <div className='flex gap-4'>
            <div className='flex flex-col gap-4'>
                <div className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                    Backlog
                </div>
                {backlogTasksToRender}
            </div>
            <div className='flex flex-col gap-4'>
                <div className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                    In Progress
                </div>
                {inProgressTasksToRender}
            </div>
            <div className='flex flex-col gap-4'>
                <div className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                    In Review
                </div>
                {inReviewTasksToRender}
            </div>
        </div>
    </div>
);*/