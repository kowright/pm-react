
import React from "react";
//import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
//import "gantt-task-react/dist/index.css";
import Gantt from './Gantt';
import './index.css'; // Import your global styles
import 'dhtmlx-gantt'; // Import Gantt library


function TimelineView() {
    const [data, setData] = React.useState(null);
    const [selectedRoadmap, setSelectedRoadmap] = React.useState('');
    const [selectedTaskStatus, setSelectedTaskStatus] = React.useState('');

    const handleFilterByRoadmap = (roadmap) => {
        setSelectedRoadmap(roadmap);
    };
    const handleFilterByTaskStatus = (status) => {
        setSelectedTaskStatus(status);
    };

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [])
  
    let ganttData = {
        data: [

        ],
        links: [
            { id: 1, source: 1, target: 2, type: '0' }
        ]
    };
    if (data && data.message) {

        let filteredTasks = selectedRoadmap
            ? data.message.filter(task => task.roadmap === selectedRoadmap)
            : data.message;

        filteredTasks = selectedTaskStatus
            ? filteredTasks.filter(task => task.taskStatus === selectedTaskStatus)
            : filteredTasks;

        filteredTasks.map((item, index) => (
            ganttData.data.push(
                {
                    
                    id: index+2,
                    text: data.message[index].name,
                    start_date: new Date(data.message[index].startDate),
                    duration: data.message[index].duration,
                    progress: 0.45,
                    
                }
            )
        
        ))
    }

    const updateTask = (item) => {
        fetch(`/api/tasks/${item.id-1}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: item.name, startDate: item.start_date, duration: item.duration }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated task:', data.task);
                // Update state immutably
          /*      setData(prev => ({
                    ...prev,
                    message: prev.message.map(task => {
                        if (task.id === (item.id - 1)) {
                            console.log("Found updated item; changing " + data.task.name);
                            return { ...task };
                        }
                        return task;
                    })
                }));*/
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };

    const handleDataUpdated = (entityType, action, item, id) => {
        console.log(`Data updated: ${entityType}, ${action}, ${item}, ${id}`);
        console.log(`It is now duration: ${item.duration}, start date: ${item.start_date} `)
        updateTask(item)
    };

    return (
        <div>
            <h1>TIMELINE VIEW</h1>
            
            <br />
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
            <div className="h-full w-full">
                <Gantt tasks={ganttData} onDataUpdated={handleDataUpdated} />
            </div>
        </div>
    );
};

export default TimelineView;

/*<div className="overflow-x-auto w-[2000px] p-4 border border-orange-600">
    <Gantt tasks={tasks} todayColor="#800080" />
</div>*/