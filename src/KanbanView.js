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
            <div key={index} className='bg-lime-300 rounded-md flex text-xl justify-center'>{key}</div>
        ))

        for (const status in tasksByStatus) {
            tasksByStatus[status].forEach((task, index) => {
                taskItems.push(
                    <div className='bg-lime-300 rounded-md flex text-xl justify-center'>{task.name}</div>
                );
            });
        }
    }

    return (
        <div>
            <h1>TIMELINE VIEW</h1>
            <p>{print}</p>

            <h1 className="text-3xl font-bold underline text-orange-800	">Task Kanban View</h1>
            <br />
            <div className={`grid grid-flow-row gap-4 grid-cols-3 grid-rows-3}`}>
                {boardHeaders}

                <div className='bg-lime-300 rounded-md flex  justify-center'>01</div>
                <div className='bg-lime-300 rounded-md flex justify-center'>02</div>
                <div className='bg-lime-300 rounded-md flex  justify-center'>03</div>
            </div>

            <br />
            <hr />
            <br />

            <div className={`grid grid-flow-col gap-4 grid-cols-3 grid-rows-3`}>

                <div className='bg-lime-300 rounded-md flex justify-center'>01</div>
                <div className='bg-lime-300 rounded-md flex justify-center'>02</div>
                <div className='bg-lime-300 rounded-md flex justify-center'>03</div>
                <div className='bg-lime-300 rounded-md flex justify-center'>04</div>
                <div className='bg-lime-300 rounded-md flex justify-center' style={{ gridColumn: '3' }}>05</div>
                <div className='bg-lime-300 rounded-md flex justify-center' style={{ gridColumn: '3' }}>06</div>
                <div className='bg-lime-300 rounded-md flex justify-center' style={{ gridColumn: '3' }}>07</div>

            </div>

            <br />
            <hr />
            <br />

            <div className={`grid grid-flow-row gap-4 grid-cols-3 grid-rows-3`}>
                {boardHeaders}
                {taskItems}

            </div>
        </div>
    );
}

export default KanbanView;
