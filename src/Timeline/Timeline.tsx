import React from 'react';
import { Milestone, Task, TaskStatus, Roadmap, formatDateNumericalMMDD, addDaysToDate } from '../Interfaces';

interface TimelineProps {
    taskClick: (task: Task | Milestone) => void;
}

export const Timeline: React.FC<TimelineProps> = ({ taskClick }) => {
    const day = 40; // Size of cell in pixels

    // Example of using the taskClick function
    const handleClick = (task: Task | Milestone) => {
        console.log("Inside Timeline component - before invoking taskClick function " + task.name);
        taskClick(task); // Invoke the function with some example task data
    };

    const [data, setData] = React.useState<{ message: Task[] } | null>(null);
    const [milestoneData, setMilestoneData] = React.useState<{ message: Milestone[]  } | null>(null);
    const [selectedRoadmap, setSelectedRoadmap] = React.useState<Roadmap | null>(null);
    const [selectedTaskStatus, setSelectedTaskStatus] = React.useState<TaskStatus | null>(null);

    const handleFilterByRoadmap = (roadmap: Roadmap) => {
        setSelectedRoadmap(roadmap);
    };

    const handleFilterByTaskStatus = (status: TaskStatus) => {
        setSelectedTaskStatus(status);
    };

    React.useEffect(() => {
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    React.useEffect(() => {
        fetch("/api/milestones")
            .then((res) => res.json())
            .then((milestoneData) => setMilestoneData(milestoneData));
    }, []);

    if (!data || !milestoneData) {
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
    const endDate = new Date('2024-09-01'); // will be user input

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
        ? data.message.filter((task) => task.roadmaps.includes(selectedRoadmap))
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
   
    //REDO HOW THIS WORKS
    /*let filteredMilestones = selectedRoadmap
        ? milestoneData?.message.filter(milestone => milestone.roadmaps.includes(selectedRoadmap))
        : milestoneData?.message;*/

     let filteredMilestones = selectedTaskStatus
        ? milestoneData?.message.filter(milestone => milestone.taskStatus === selectedTaskStatus)
        : milestoneData?.message;
    console.log("milestones c " + filteredMilestones.length)

    filteredMilestones = filteredMilestones.filter(milestone => new Date(milestone.date) <= endDate);

    let milestones = filteredMilestones.map((milestone, index) => {
        let width = `${day * 4}px`;
        let top = `${day * 4}px`;
        let height = `${day * 4 * filteredTasks.length}px`;

        let dateRange = Math.round((new Date(milestone.date).getTime() - startDate.getTime()) / (1000 * 3600 * 24));
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
            <div key={index} style={containerStyles} onClick={() => handleClick(milestone)}>
                <p className="text-white text-center">{milestone.name}</p>
            </div>
        );
    });
    // #endregion

    return (
        <div>
            {/* ADD BACK FILTER BUTTONS */}
            <p className='flex justify-center text-3xl text-white'>DATE RANGE:  {formatDateNumericalMMDD(startDate)} - {formatDateNumericalMMDD(endDate)}</p>

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
