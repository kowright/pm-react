import React, { useEffect, useState } from "react";
import { Task, TaskStatus, Roadmap } from './Interfaces';

interface KanbanViewProps {

}

 export const KanbanView = ({
        ...props
    }: KanbanViewProps) => {


    const [data, setData] = useState <{ message: Task[] } | null> (null);
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null> (null); //keep
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null); //keep
    const [roadmapData, setRoadmapData] = useState<{ message: Roadmap[] } | null>(null);
    const [taskStatusData, setTaskStatusData] = useState<{ message: TaskStatus[] } | null>(null);


     const handleFilterByRoadmap = (roadmap: Roadmap | null) => { //keep
         setSelectedRoadmap(roadmap);
     };

    const handleFilterByTaskStatus = (status: TaskStatus | null) => { //keep
        setSelectedTaskStatus(status);
    };

    useEffect(() => { //keep for now until App gives it to you
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

     useEffect(() => {
         fetch("/api/roadmaps")
             .then((res) => res.json())
             .then((data) => setRoadmapData(data))
             .catch((error) => console.error('Error fetching data:', error));
     }, []);

    if (!data || !roadmapData) {
        return <div> oh no</div>
    }

        let filteredTasks = data.message;

        if (selectedRoadmap) {
            filteredTasks = filteredTasks.filter(task => task.roadmaps.includes(selectedRoadmap));
        }

        if (selectedTaskStatus) {
            filteredTasks = filteredTasks.filter(task => task.taskStatus === selectedTaskStatus);
        }

        const tasksByStatus = filteredTasks.reduce((acc: Record<string, Task[]>, task: Task) => {
            const status = task.taskStatus.name;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(task);
            return acc;
        }, {});

    
    let tasksToRender: any = tasksByStatus['Backlog']?.map((task, index) => (
        <div key={task.id} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
            {task.name}
        </div>
    )); 

        let inProgressTasksToRender: any = tasksByStatus['In Progress']?.map((task, index) => (
            <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                {task.name}
            </div>
        ));

        let inReviewTasksToRender: any = tasksByStatus['In Review']?.map((task, index) => (
            <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                {task.name}
            </div>
        ));

    //ADD ALL ROADMAPS BUTTON 
     let roadmapButtons = roadmapData.message.map(roadmap =>
             <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap?.name === roadmap.name ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => selectedRoadmap && handleFilterByRoadmap(roadmap)}>{roadmap.name} Roadmap Tasks</button>
        )

     let taskStatusButtons = taskStatusData?.message.map(status =>
         <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus?.name === status.name ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => selectedTaskStatus && handleFilterByTaskStatus(status)}>{status.name}</button>

     )

    return (
        <div>
            <br/>
            <p className='flex justify-center text-3xl text-white'>KANBAN VIEW</p>
            <div className='flex gap-4'>
                <div className='flex flex-col gap-4'>
                    <div className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                        Backlog
                    </div>
                    {tasksToRender}
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
    );
}

export default KanbanView;
