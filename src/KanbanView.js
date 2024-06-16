import React, { useEffect, useState } from "react";

function KanbanView() {
    const [data, setData] = useState(null);

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

    if (data && data.message) {
        // Example of accessing data.message safely
        console.log(data.message); // Log data.message safely
        print = data.message[0].name; // Assign print based on fetched data

        const tasksByStatus = data.message.reduce((acc, task) => {
            const status = task.taskStatus;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(task);
            return acc;
        }, {});

        console.log(tasksByStatus['Backlog'][0])
        console.log(Object.keys(tasksByStatus).length)

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
        tasksToRender = tasksByStatus['Backlog'].map((task, index) => (
            <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                {task.name}
            </div>
        ));

        inProgressTasksToRender = tasksByStatus['In Progress'].map((task, index) => (
            <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                {task.name}
            </div>
        ));

        inReviewTasksToRender = tasksByStatus['In Review'].map((task, index) => (
            <div key={index} className='bg-cyan-400 rounded-md flex text-xl justify-center w-80'>
                {task.name}
            </div>
        ));
    }

    return (
        <div>
            <h1>Kanban View</h1>

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
