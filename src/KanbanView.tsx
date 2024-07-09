import React, { useEffect, useState } from "react";
import { Task, TaskStatus, Roadmap, Milestone, Assignee, Tag, formatDateNumericalMMDDYYYY } from './Interfaces';
import { FilterButton } from './FilterButton';

interface KanbanViewProps {
    roadmap: Roadmap | null; //group filter properties together
    taskStatus: TaskStatus | null;
    rowClick: (task: Task | Milestone | Tag | Assignee) => void;
    taskData: Task[];
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
         console.log("Inside Timeline component - before invoking taskClick function " + task.name);
         props.rowClick(task); // Invoke the function with some example task data
     };

/*    useEffect(() => { //keep for now until App gives it to you
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data) => setTaskData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);*/

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

    
      filteredTasks = props.taskStatus
          ? props.taskData.filter(task => task.taskStatus.name === props.taskStatus!.name)
          : props.taskData;


     filteredTasks = props.roadmap
         ? filteredTasks.filter(task => {
             const roadmaps = task.roadmaps.map(map => map.name);
             return roadmaps.includes(props.roadmap!.name);
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
             <div key={task.id} onClick={() => handleClick(task)} className="cursor-pointer hover:bg-lime-500 bg-cyan-400 rounded-md flex flex-col text-xl justify-center w-[320px] gap-1 p-2">
                 <div className='text-lg font-bold'> {task.name}</div>
                 <div className='text-sm'>{task.description}</div>
                 <div className='text-xs'>{formatDateNumericalMMDDYYYY(new Date (task.startDate))} - {formatDateNumericalMMDDYYYY( new Date(task.endDate))}</div>
                 <div className='w-auto flex justify-start gap-x-2'>
                     {task.tags.map(tag =>
                         <FilterButton text={tag.name} onClick={() => console.log("eng")} />
                     )}
                     {task.roadmaps.map(map =>
                         <FilterButton text={map.name} onClick={() => console.log("eng")} />
                     )}
                 </div>
             </div>
         )));

    return (
        <div className='mx-8'>
            <br/>
            <div className='flex gap-4'>
                <div className='flex gap-4'>
                    {statusColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col space-y-4">
                            <h1 className="text-xl text-white text-center font-bold">{Object.keys(tasksByStatus)[columnIndex]}</h1>
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