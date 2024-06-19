import React from 'react';


const Timeline = () => {

    const timeLength = 365; 
    const day = 40;

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

    if (!data) {
        return <p>Loading...!</p>; // Render loading until data is fetched
    }

    let filteredTasks = selectedRoadmap
        ? data.message.filter(task => task.roadmap === selectedRoadmap)
        : data.message;

    filteredTasks = selectedTaskStatus
        ? filteredTasks.filter(task => task.taskStatus === selectedTaskStatus)
        : filteredTasks;


    let tasks = filteredTasks.map((task, index) => {
            let width = `${day * task.duration * 4}px`;
            let top = `${day * (index + 1) * 4}px`;

            const containerStyles = {
                position: 'absolute',
                left: 0,
                top: top,
                width: width,
                height: `${day*4}px`, 
                backgroundColor: 'gray',
                borderRadius: '0.5rem', // Example border radius
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // Example shadow
                zIndex: 20
            };

            return (
                 <div style={containerStyles}>
                    <p className="text-white text-center">{task.name}</p>
                </div>
            );
    });

    let tempMilestones = [
        {
            name: "Specifications Done",
            date: new Date('2024-06-07'),
            roadmaps: ['Engineering Roadmap'],
            taskStatus: 'In Progress'
        },
      /*  {
            name: "Design Done",
            date: new Date('2024-06-10'),
            roadmaps: ['Design Roadmap'],
            taskStatus: 'In Review'
        },
        {
            name: "Prototype Completed",
            date: new Date('2024-06-15'),
            roadmaps: ['Engineering Roadmap', 'Design Roadmap'],
            taskStatus: 'Backlog'
        },*/
    ];

    let filteredMilestones = selectedRoadmap
        ? tempMilestones.filter(milestone => milestone.roadmaps.includes(selectedRoadmap))
        : tempMilestones;

    filteredMilestones= selectedTaskStatus
        ? filteredMilestones.filter(milestones => milestones.taskStatus === selectedTaskStatus)
        : filteredMilestones;


    let milestones = filteredMilestones.map((milestone, index) => {

        let width = `${day * 4}px`;
        let top = `${day * 4}px`;
        let height = `${day * 4 * filteredTasks.length}px`;

        const containerStyles = {
            position: 'absolute',
            left: '960px',
            top: top,
            overflow: 'hidden',
            width: width,
            height: height,
            backgroundColor: '#F59E0B',
            borderRadius: '0.375rem', // Assuming you want the rounded corners to be 6px (0.375rem)
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Mimicking the shadow effect
            zIndex: 30
        }

        return (
             <div style={containerStyles} >
                    <p className="text-white text-center">{milestone.name}</p>
                </div>
        );
    });



    const tableHeaderStyle = {
        width: `${day * 4}px`,
        height: `${(day / 2) * 4}px`,
        border: '1px solid #ccc',
        textAlign: 'center'
    }

    function formatDateNumerical(date) {
        const options = { month: '2-digit', day: '2-digit' };
        const formattedDate = date.toLocaleDateString('en-US', options).replace(/\//g, '-');
        return formattedDate;
    }
    function formatDayOfWeek(date) {
        const options = { weekday: 'short' };
        return date.toLocaleDateString('en-US', options);
    }


    let numberedDateElements = [];
    let dayOfWeekDateElements = [];
    const startDate = new Date('2024-06-01');
    const endDate = new Date('2024-07-10');

    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {


        const numberedDateElement = <th style={tableHeaderStyle}>{formatDateNumerical(currentDate)}</th>
        const dayOfWeekDateElement = <th style={tableHeaderStyle}>{formatDayOfWeek(currentDate)}</th>

        numberedDateElements.push(numberedDateElement);
        dayOfWeekDateElements.push(dayOfWeekDateElement);
    }
    console.log(numberedDateElements.length)
    const tableRowStyle = {
        width: `${day * 4}px`,
        height: `${day * 4}px`,
        border: '1px solid #ccc',
        textAlign: 'center'
    }

    let tableRows = [];
    function createRows(numRows, numColumns = numberedDateElements.length) {
        for (let i = 0; i < numRows; i++) {
            let tableCells = [];

            for (let j = 0; j < numColumns; j++) {
                tableCells.push(
                    <td key={`row-${i}-col-${j}`} style={tableRowStyle}>
                        Cell {j + 1}
                    </td>
                );
            }

            tableRows.push(
                <tr key={`row-${i}`}>
                    {tableCells}
                </tr>
            )
        }
        return tableRows;
    }

    return (
        <div>
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
  
            <div className='w-full h-full bg-purple-100 overflow-x-auto relative shrink-0 flex' style={{ width: '2000px' }} >
             
                {milestones}

                {tasks}


                <table className="border-collapse border border-gray-800 shrink-0 z-0">
                    <thead>
                        <tr>
                            {numberedDateElements }
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            {dayOfWeekDateElements}
                        </tr>
                    </thead>

                        <tbody>
                            {createRows(filteredTasks.length, ) }
                        </tbody>
                    </table>
          
            </div>
        </div>
    );


};

export default Timeline;

    /*            <div className='bg-blue-300'>
                Header
            </div>
            <div className='bg-orange-300 flex w-full h-10 justify-between'>
                <div className='bg-purple-300 border border-purple-800 flex justify-center items-center'>TASK 1</div>
                <div className='bg-purple-300 border border-purple-800 flex justify-center items-center'>TASK 2</div>
                <div className='bg-purple-300 border border-purple-800 flex justify-center items-center'>TASK 3</div>
            </div>
            <div className='bg-orange-300 flex w-full h-10'>
                hi
            </div>
            <div className='bg-orange-300 flex w-full h-10'>
                hi
            </div>*/


/*
<div className='h-full w-5/6 bg-lime-300 flex grid grid-cols-10 divide-x-4 divide-y-4 divide-solid grid-rows-3 divide-black'>
    <div className='bg-purple-300 border border-purple-800 flex justify-center items-center'>TASK 1</div>


</div>*/


/*
<table class='table-auto border-collapse border border-slate-600'>
    <thead>
        <th class='border border-slate-600'>06/01</th>
        <th class='border border-slate-600'>06/02</th>
        <th class='border border-slate-600'>06/03</th>
        <th class='border border-slate-600'>06/04</th>
        <th class='border border-slate-600'>06/05</th>
    </thead>
    <tbody>
        <tr>
            <td class='border border-slate-600'>no</td>
            <td class='border border-slate-600'>yes</td>
            <td class='border border-slate-600'>no</td>
            <td class='border border-slate-600'>yes</td>
            <td class='border border-slate-600'>no</td>

        </tr>
    </tbody>
</table>*/


   /*      <div class="grid grid-rows-3 grid-flow-col gap-4">
                <div class="row-span-3 bg-lime-300">01</div>
                <div class="col-span-2 bg-orange-300">02</div>
                <div class="row-span-2 col-span-2 bg-blue-300">03</div>
            </div>
            <br />
            <div class="grid grid-rows-3 grid-cols-3">
                <div class="col-span-3 row-span-1 bg-rose-300 flex justify-center items-center">01</div>
                <div class="col-span-2 row-span-1 bg-orange-300 flex justify-center items-center">02</div>
                <div class="col-start-3 col-end-4 row-start-3 row-end-4 bg-blue-300 flex justify-center items-center">03</div>
            </div>
*/

/*
<div className="flex items-center h-screen">
    <div className="relative left-20 w-40 h-40 bg-blue-500 rounded-md shadow-md z-10">
        <p className="text-white text-center">Box 1</p>
    </div>
    <div className="relative top-0 left-10 w-40 h-40 bg-red-500 rounded-md shadow-md z-20">
        <p className="text-white text-center">Box 2</p>
    </div>
    <div className="relative top-0 left-0 w-40 h-40 bg-green-500 rounded-md shadow-md z-30">
        <p className="text-white text-center">Box 2</p>
    </div>
</div>
*/


/*
<div className='w-full h-full bg-purple-100 flex items-center'>
    <div className="flex items-center overflow-x-auto">
        <div className="w-40 h-40 bg-blue-500 shrink-0 rounded-md shadow-md z-10 mr-4">
            <p className="text-white text-center">Box 1</p>
        </div>
        <div className="w-40 h-40 bg-red-500 shrink-0 rounded-md shadow-md z-20 mr-4">
            <p className="text-white text-center">Box 2</p>
        </div>
        <div className="w-[4000px] shrink-0 h-40 bg-green-500 rounded-md shadow-md z-30 mr-4">
            <p className="text-white text-center">Box 3</p>
        </div>
        {*//* Add more boxes if needed *//*}
    </div>
</div>*/



/*<div className='w-full h-full bg-purple-100 flex'>

    <div className="flex flex-col overflow-x-auto">
        <div className="relative left-10 w-80 h-40 bg-blue-500 rounded-md shadow-md">
            <p className="text-white text-center">Box 1</p>
        </div>
        <div className="relative left-40 w-40 h-40 bg-red-500 rounded-md shadow-md">
            <p className="text-white text-center">Box 2</p>
        </div>
        <div className="w-[4000px] h-40 bg-green-500 rounded-md shadow-md">
            <p className="text-white text-center">Box 3</p>
        </div>

    </div>
</div>
*/



/*<div className='w-full h-full bg-purple-100 flex'>
    <div className="absolute">
        <table className="border-collapse border border-gray-400">
            <tbody>
                <tr>
                    <td className="w-40 h-40 border border-gray-400 text-center"></td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                    <td className="w-40 h-40 border border-gray-400 text-center"></td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                </tr>
                <tr>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                    <td className="w-40 h-40 border border-gray-400 text-center"></td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                    <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                </tr>
            </tbody>
        </table>
    </div>
    <div className="flex flex-col overflow-x-auto">
        <div className="relative left-10 w-80 h-40 bg-blue-500 rounded-md shadow-md">
            <p className="text-white text-center">Box 1</p>
        </div>
        <div className="relative left-40 w-40 h-40  bg-red-500 rounded-md shadow-md">
            <p className="text-white text-center">Box 2</p>
        </div>
        <div className="w-[4000px] h-40 bg-green-500 rounded-md shadow-md">
            <p className="text-white text-center">Box 3</p>
        </div>

    </div>
</div>
*/


/*<div className='w-full h-full bg-purple-100 flex'>

    <div className="flex flex-col overflow-x-auto relative">
        {*//* Table container *//*}
        <div className="absolute top-0 left-0 shrink-0 ">
            <table className="border-collapse border border-gray-400">

                <tbody>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                    </tr>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 9</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 10</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 11</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 12</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 13</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 14</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 15</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 16</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                    </tr>
                </tbody>
            </table>
        </div>

        {*//* Overlay boxes *//*}
        <div className="relative left-10 w-80 h-40 bg-blue-500 opacity-20 rounded-md shadow-md z-10">
            <p className="text-white text-center">Box 1</p>
        </div>
        <div className="relative left-0 w-40 h-40 bg-red-500 rounded-md shadow-md opacity-20 z-20">
            <p className="text-white text-center">Box 2</p>
        </div>
        <div className="w-[4000px] h-40 bg-green-500 rounded-md opacity-20 shadow-md z-30">
            <p className="text-white text-center">Box 3</p>
        </div>
    </div>

</div>*/

/*
<div>
    <div className='flex bg-purple-100'>
        <div className='relative overflow-x-auto shrink-0'>
            <div className="absolute grid grid-cols-10 grid-rows-3 bg-gray-400 opacity-20 w-full h-full">
                <div className="col-span-2 row-span-1 bg-blue-500 flex items-center justify-center">03</div>
            </div>



            <table className="border-collapse border border-gray-800 shrink-0 z-0">
                <thead>
                    <tr>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/1</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/2</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/3</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/4</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/5</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/6</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/7</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/8</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/9</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/10</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/11</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/12</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/13</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/14</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/15</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/16</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/17</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/18</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/19</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/20</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/21</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/22</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/23</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/24</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/25</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/26</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/27</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/28</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/29</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">6/30</th>
                    </tr>
                </thead>
                <thead>
                    <tr>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sat</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sun</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Mon</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Tues</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Wed</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Thurs</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Fri</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sat</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sun</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Mon</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Tues</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Wed</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Thurs</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Fri</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sat</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sun</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Mon</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Tues</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Wed</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Thurs</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Fri</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sat</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sun</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Mon</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Tues</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Wed</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Thurs</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Fri</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sat</th>
                        <th className="w-40 h-20 border border-gray-400 text-center">Sun</th>

                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                    </tr>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                    </tr>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                    </tr>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                    </tr>
                    <tr>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 7</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 8</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 1</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 2</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 3</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 4</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 5</td>
                        <td className="w-40 h-40 border border-gray-400 text-center">Cell 6</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

</div> */