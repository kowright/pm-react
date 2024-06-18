import React, { useEffect, useState } from "react";

function KanbanView() {
    const [data, setData] = useState(null);

    const [selectedRoadmap, setSelectedRoadmap] = React.useState('');
    const [selectedTaskStatus, setSelectedTaskStatus] = React.useState('');

    const handleFilterByRoadmap = (roadmap) => {
        setSelectedRoadmap(roadmap);
    };
    const handleFilterByTaskStatus = (status) => {
        setSelectedTaskStatus(status);
    };


    useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    // Conditional rendering based on data availability
    let print = 'Loading...';
    let boardHeaders;
    let taskItems = [];
    let tasksToRender;
    let inProgressTasksToRender;
    let inReviewTasksToRender;
    let filteredTasks;

    if (data && data.message) {
        // Example of accessing data.message safely
        console.log(data.message); // Log data.message safely
        print = data.message[0].name; // Assign print based on fetched data

        filteredTasks = selectedRoadmap
            ? data.message.filter(task => task.roadmap === selectedRoadmap)
            : data.message;

        filteredTasks = selectedTaskStatus
            ? filteredTasks.filter(task => task.taskStatus === selectedTaskStatus)
            : filteredTasks;

        console.log("filtered tasks " + filteredTasks)
        const tasksByStatus = filteredTasks.reduce((acc, task) => {
            const status = task.taskStatus;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(task);
            return acc;
        }, {});
        

        let gridColumnNum = 'grid-cols-' + Object.keys(tasksByStatus).length;

        let maxItemCount = 0;

        // Iterate through each key in the `message` object
        for (let key in tasksByStatus) {
            // Count the number of items in the array for the current key
            const itemCount = tasksByStatus[key].length;

            // Check if this count is greater than the current maximum
            if (itemCount > maxItemCount) {
                maxItemCount = itemCount;
            }
        }
        maxItemCount += 1
        let gridRowNum = 'grid-rows-' + (maxItemCount);

        console.log(gridRowNum + " x " + gridColumnNum)

        boardHeaders = Object.keys(tasksByStatus).map((key, index) => (
            <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center'>{key}</div>
        ))

        

        for (const status in tasksByStatus) {
            tasksByStatus[status].forEach((task, index) => {
                taskItems.push(
                    <div className='bg-cyan-400 rounded-md flex text-xl justify-center'>{task.name}</div>
                );
            });
        }
       console.log("tasks " + tasksToRender)

        if (tasksByStatus['Backlog']) {
            tasksToRender = tasksByStatus['Backlog'].map((task, index) => (
                <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                    {task.name}
                </div>
            ));
        } else {
            tasksToRender = <div></div>;
        }

        if (tasksByStatus['In Progress']) {
            inProgressTasksToRender = tasksByStatus['In Progress'].map((task, index) => (
                <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                    {task.name}
                </div>
            ));
        } else {
            inProgressTasksToRender = <div></div>;
        }

        if (tasksByStatus['In Review']) {
            inReviewTasksToRender = tasksByStatus['In Review'].map((task, index) => (
                <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                    {task.name}
                </div>
            ));
        } else {
            inReviewTasksToRender = <div></div>;
        }
    }

    return (
        <div>
            <h1>Kanban View</h1>

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
            <br/>
            <div className={`flex gap-4`}>
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

//todo
//make it look nicer & bigger
//make items clickable for sidebar
//show tags on items 
