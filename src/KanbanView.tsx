import React, { useEffect, useState } from "react";
import {Task} from './Interfaces';

interface KanbanViewProps {

}

 export const KanbanView = ({
        ...props
    }: KanbanViewProps) => {


    const [data, setData] = useState < { message: Task[] } | null > (null);
    const [selectedRoadmap, setSelectedRoadmap] = useState < string > ('');
    const [selectedTaskStatus, setSelectedTaskStatus] = useState < string > ('');

    const handleFilterByRoadmap = (roadmap: string) => {
        setSelectedRoadmap(roadmap);
    };

    const handleFilterByTaskStatus = (status: string) => {
        setSelectedTaskStatus(status);
    };

    useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);


    if (!data) {
        return <div> oh no</div>
    }

        let filteredTasks = data.message;

        if (selectedRoadmap) {
            filteredTasks = filteredTasks.filter(task => task.roadmap === selectedRoadmap);
        }

        if (selectedTaskStatus) {
            filteredTasks = filteredTasks.filter(task => task.taskStatus === selectedTaskStatus);
        }

        const tasksByStatus = filteredTasks.reduce((acc: Record<string, Task[]>, task: Task) => {
            const status = task.taskStatus;
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
    

    return (
        <div>
            <br/>
            <p className='flex justify-center text-3xl text-white'>KANBAN VIEW</p>

            <div className='flex gap-4 justify-center'>
                <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap === "Engineering Roadmap" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByRoadmap("Engineering Roadmap")}>Engineering Roadmap Tasks</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap === "Design Roadmap" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByRoadmap("Design Roadmap")} >Design Roadmap Tasks</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap === "" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByRoadmap("")}>All Roadmaps</button>
            </div>
            <br />
            <div className='flex gap-4 justify-center'>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "In Progress" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("In Progress")}>In Progress</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "In Review" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("In Review")}>In Review</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "Backlog" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("Backlog")}>Backlog</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("")}>All Statuses</button>
            </div>
            <br />
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
