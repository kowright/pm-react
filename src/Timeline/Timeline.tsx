import React from 'react';
import { Milestone, Task, formatDateNumericalMMDD } from '../Interfaces';

interface TimelineProps {
    taskClick: (task: Task) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ taskClick }) => {
    const day = 40; // Size of cell in pixels

    // Example of using the taskClick function
    const handleClick = (task: Task) => {
        console.log("Inside Timeline component - before invoking taskClick function " + task.name);
        taskClick(task); // Invoke the function with some example task data
    };

    const [data, setData] = React.useState<{ message: Task[] } | null>(null);
    const [selectedRoadmap, setSelectedRoadmap] = React.useState<string>('');
    const [selectedTaskStatus, setSelectedTaskStatus] = React.useState<string>('');

    const handleFilterByRoadmap = (roadmap: string) => {
        setSelectedRoadmap(roadmap);
    };

    const handleFilterByTaskStatus = (status: string) => {
        setSelectedTaskStatus(status);
    };

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    if (!data) {
        return <p>Loading...!</p>; // Render loading until data is fetched
    }

    // #region Table
    // Table Header Styles
    const tableHeaderStyle: React.CSSProperties = {
        width: `${day * 4}px`,
        height: `${(day / 2) * 4}px`,
        border: '1px solid #ccc',
        textAlign: 'center'
    };

    const formatDayOfWeek = (date: Date): string => {
        const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        return daysOfWeek[date.getDay()]
    };


    // Generating numbered date elements and day of week date elements
    let numberedDateElements: JSX.Element[] = [];
    let dayOfWeekDateElements: JSX.Element[] = [];
    const startDate = new Date('2024-06-01'); // will be user input
    const endDate = new Date('2024-07-22'); // will be user input

    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(startDate.getDate() + 1);

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(endDate.getDate() + 1);

    for (let currentDate = adjustedStartDate; currentDate <= adjustedEndDate; currentDate.setDate(currentDate.getDate() + 1)) {
        numberedDateElements.push(<th key={currentDate.toISOString()} style={tableHeaderStyle}>{formatDateNumericalMMDD(currentDate)}</th>);
        dayOfWeekDateElements.push(<th key={currentDate.toISOString()} style={tableHeaderStyle}>{formatDayOfWeek(currentDate)}</th>);
    }

    // Generating table rows
    const tableRowStyle: React.CSSProperties = {
        width: `${day * 4}px`,
        height: `${day * 4}px`,
        border: '1px solid #ccc',
        textAlign: 'center'
    };

    const createRows = (numRows: number, numColumns: number = numberedDateElements.length): JSX.Element[] => {
        let tableRows: JSX.Element[] = [];
        for (let i = 0; i < numRows; i++) {
            let tableCells: JSX.Element[] = [];
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
            );
        }
        return tableRows;
    };
    // #endregion

    // #region Tasks
    let filteredTasks = selectedRoadmap
        ? data.message.filter((task) => task.roadmap === selectedRoadmap)
        : data.message;

    filteredTasks = selectedTaskStatus
        ? filteredTasks.filter((task) => task.taskStatus === selectedTaskStatus)
        : filteredTasks;

    filteredTasks = filteredTasks.filter((task) => new Date(task.startDate) <= endDate);

    let tasks = filteredTasks.map((task, index) => {
        let top = `${day * (index + 1) * 4}px`;
        let lengthRange = Math.round((endDate.getTime() - new Date(task.endDate).getTime()) / (1000 * 3600 * 24));
        let width = lengthRange < 0 ? `${day * (task.duration + lengthRange + 1) * 4}px` : `${day * task.duration * 4}px`;

        let startOffset = Math.round((new Date(task.startDate).getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        let left = `${day * 4 * startOffset}px`;

        const containerStyles: React.CSSProperties = {
            position: 'absolute',
            left: left,
            top: top,
            width: width,
            height: `${day * 4}px`,
            backgroundColor: 'gray',
            borderRadius: '0.5rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 20
        };

        return (
            <div key={task.id} style={containerStyles} onClick={() => handleClick(task)}>
                <p className="text-white text-center">{task.name}</p>
            </div>
        );
    });
    // #endregion

    // #region Milestones
    let tempMilestones: Milestone[] = [
        {
            name: "Specifications Done",
            date: new Date('2024-06-07'),
            roadmaps: ['Engineering Roadmap'],
            taskStatus: 'In Progress'
        },
        {
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
        },
    ];

    let filteredMilestones = selectedRoadmap
        ? tempMilestones.filter(milestone => milestone.roadmaps.includes(selectedRoadmap))
        : tempMilestones;

    filteredMilestones = selectedTaskStatus
        ? filteredMilestones.filter(milestone => milestone.taskStatus === selectedTaskStatus)
        : filteredMilestones;

    filteredMilestones = filteredMilestones.filter(milestone => milestone.date <= endDate);

    let milestones = filteredMilestones.map((milestone, index) => {
        let width = `${day * 4}px`;
        let top = `${day * 4}px`;
        let height = `${day * 4 * filteredTasks.length}px`;

        let dateRange = Math.round((milestone.date.getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        let left = `${day * 4 * dateRange}px`;

        const containerStyles: React.CSSProperties = {
            position: 'absolute',
            left: left,
            top: top,
            overflow: 'hidden',
            width: width,
            height: height,
            backgroundColor: '#F59E0B',
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 30
        };

        return (
            <div key={index} style={containerStyles}>
                <p className="text-white text-center">{milestone.name}</p>
            </div>
        );
    });
    // #endregion

    return (
        <div>
            <div className='flex gap-4 justify-center'>
                <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap === "Engineering Roadmap" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByRoadmap("Engineering Roadmap")}>Engineering Roadmap Tasks</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap === "Design Roadmap" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByRoadmap("Design Roadmap")}>Design Roadmap Tasks</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedRoadmap === "" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByRoadmap("")}>All Roadmaps</button>
            </div>
            <br />
            <div className='flex gap-4 justify-center'>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "In Progress" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("In Progress")}>In Progress</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "In Review" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("In Review")}>In Review</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "Backlog" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("Backlog")}>Backlog</button>
                <button className={`rounded border border-cyan-200 p-2 ${selectedTaskStatus === "" ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => handleFilterByTaskStatus("")}>All Statuses</button>
            </div>
            <h1>Date Range: {formatDateNumericalMMDD(startDate)} - {formatDateNumericalMMDD(endDate)}</h1>
            <div className='7h-full bg-purple-100 overflow-x-auto relative shrink-0 flex' style={{ width: '2000px' }}>
                {milestones}
                {tasks}
                <table className="border-collapse border border-gray-800 shrink-0 z-0">
                    <thead>
                        <tr>
                            {numberedDateElements}
                        </tr>
                    </thead>
                    <thead>
                        <tr>
                            {dayOfWeekDateElements}
                        </tr>
                    </thead>
                    <tbody>
                        {createRows(filteredTasks.length)}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
