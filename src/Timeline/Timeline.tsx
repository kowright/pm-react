import React from 'react';
import { Milestone, Task, TaskStatus, Roadmap, Tag, Assignee, formatDateNumericalMMDD, addDaysToDate } from '../Interfaces';

interface TimelineProps {
    taskClick: (task: Task | Milestone) => void;
    roadmap: Roadmap | null; //group filter properties together
    taskStatus: TaskStatus | null;
    taskData: Task[];
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;

}

export const Timeline = ({
    ...props
}: TimelineProps) => {
    const day = 20; // Size of cell in pixels

    // Example of using the taskClick function
    const handleClick = (task: Task | Milestone) => {
       // console.log("Inside Timeline component - before invoking taskClick function " + task.name);
        props.taskClick(task); // Invoke the function with some example task data
    };

    const [data, setData] = React.useState<{ message: Task[] } | null>(null);
    const [milestoneData, setMilestoneData] = React.useState<{ message: Milestone[]  } | null>(null);
    const [selectedRoadmap, setSelectedRoadmap] = React.useState<Roadmap | null>(null);
    const [selectedTaskStatus, setSelectedTaskStatus] = React.useState<TaskStatus | null>(null);
    const [selectedStartDate, setSelectedStartDate] = React.useState('2024-06-01');
    const [selectedEndDate, setSelectedEndDate] = React.useState('2024-09-01');

    const [draggedTask, setDraggedTask] = React.useState<Task>(props.taskData[0]);
    const [draggedMilestone, setDraggedMilestone] = React.useState<Milestone>(props.milestoneData[0]);

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [draggedDiv, setDraggedDiv] = React.useState<HTMLDivElement | null>(null);
    const [startDragPoint, setStartDragPoint] = React.useState<number>(0)
    const [dragId, setDragId] = React.useState<number>(-1)
    const [milestoneDragId, setMilestoneDragId] = React.useState<number>(-1);
    const handleFilterByRoadmap = (roadmap: Roadmap) => {
        setSelectedRoadmap(roadmap);
    };

    const handleFilterByTaskStatus = (status: TaskStatus) => {
        setSelectedTaskStatus(status);
    };

/*    React.useEffect(() => {
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    React.useEffect(() => {
        fetch("/api/milestones")
            .then((res) => res.json())
            .then((milestoneData) => setMilestoneData(milestoneData));
    }, []);*/

  /*  if (!data || !milestoneData) {
        return <p>Loading...!</p>; // Render loading until data is fetched
    }*/

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
    const startDate = new Date(selectedStartDate); // will be user input
    const endDate = new Date(selectedEndDate); // will be user input

    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(startDate.getDate() + 1);

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(endDate.getDate() + 1);

    for (let currentDate = adjustedStartDate; currentDate <= adjustedEndDate; currentDate.setDate(currentDate.getDate() + 1)) {
        numberedDateElements.push(<th key={currentDate.toISOString()} className='bg-purple-300' style={tableHeaderStyle}>{formatDateNumericalMMDD(currentDate)}</th>);
        dayOfWeekDateElements.push(<th key={currentDate.toISOString()} className='bg-purple-300' style={tableHeaderStyle}>{formatDayOfWeek(currentDate)}</th>);
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

  /*

    const handleMouseDown = (task: Task, event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDraggedTask(task);
        console.log("mouse down task " + task.name)
        setDraggedDiv(event.currentTarget);
        setDragId(task.id)
        const scrollContainer = scrollContainerRef.current;
        const mouseX = event.clientX;
        if (scrollContainer) {
            const rect = scrollContainer.getBoundingClientRect();
            const containerLeft = rect.left;

            // Calculate mouse position relative to the scroll container
          *//*  const mouseInsideContainer = mouseX - containerLeft + scrollContainer.scrollLeft;
            setStartDragPoint(mouseInsideContainer)*//*
        }
        //console.log("set task")

        //function for thirds
*//*        function getDefaultNumberInRange(lowerNumber: number, upperNumber:number, numberToCheck:number) {
            // Calculate the midpoint of the range
            const midpoint = (upperNumber + lowerNumber) / 2;

            // Calculate offsets for thirds
            const third = (upperNumber - lowerNumber) / 3;
            const offset = day * 4;
            // Check which third the numberToCheck falls into
            if (numberToCheck < midpoint - third) {
                console.log('Go down'); // Lower third
                return lowerNumber - offset; // Return lowerNumber minus an offset
            } else if (numberToCheck > midpoint + third) {
                console.log('Go up'); // Upper third
                return lowerNumber + offset; // Return upperNumber plus an offset
            } else {
                console.log('Stay in middle'); // Middle third
                return lowerNumber; // Return lowerNumber for the middle third
            }
        }*//*
        //works for click moves
*//*
        function getDefaultNumberInRange(lowerNumber: number, upperNumber: number, numberToCheck: number) {
            // Calculate the midpoint of the range
            const midpoint = (upperNumber + lowerNumber) / 2;
            const offset = day * 4;

            // Check if the number is in the lower half or upper half
            if (numberToCheck < midpoint) {
                console.log('go down')
                return lowerNumber - offset; // Default to lowerNumber if in the lower half
            } else {
                console.log("go up")
                return lowerNumber + offset ; // Default to upperNumber if in the upper half
            }
        }


        // Access the HTML element and print its left position relative to its offset parent
        const element = event.currentTarget;
        const elementCurrentLeft = element.offsetLeft
        let lengthRange = Math.round((endDate.getTime() - new Date(task.endDate).getTime()) / (1000 * 3600 * 24));
        let width = lengthRange < 0 ? day * (task.duration + lengthRange + 1) * 4 : day * task.duration * 4;
        const elementCurrentRight = elementCurrentLeft + width;
        //console.log("width " + width);
        //console.log('Div element left position:', element.offsetLeft);


        const mouseX = event.clientX;
        // Get the scroll container element
        const scrollContainer = scrollContainerRef.current;

        if (scrollContainer) {
            const rect = scrollContainer.getBoundingClientRect();
            const containerLeft = rect.left;

            // Calculate mouse position relative to the scroll container
            const mouseInsideContainer = mouseX - containerLeft + scrollContainer.scrollLeft;

            //console.log('Mouse position inside scroll container:', mouseInsideContainer);

            const newLeft = getDefaultNumberInRange(elementCurrentLeft, elementCurrentRight, mouseInsideContainer);
            console.log("new left " + newLeft)

            element.style.left = `${newLeft}px`; // Update 'left' position



        }*//*

        attachMouseMoveListener();

    };

    React.useEffect(() => {
        console.log('Component mounted.'); // Check if this log is triggered on component mount

        // Cleanup function to remove event listener when component unmounts
        return () => {
            console.log('Component unmounted.'); // Check if this log is triggered on component unmount
            document.removeEventListener('mousemove', handleMouseMove);
        };
    }, []); // Empty dependency array ensures this effect runs only once on mount


    // Function to handle mouseup event
    const handleMouseUp = () => {
        //console.log("mouse up")
        // document.removeEventListener('mousemove', handleMouseMove, true);
        //setDraggedTask(null);
    };


    const attachMouseMoveListener = () => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', function () {
            console.log("mouse up listener")
            document.removeEventListener('mousemove', handleMouseMove);
            document.onmouseup = null;
            setDragId(-1)
            //setDraggedTask(null);
        })
    };


    const handleMouseMove = (event: MouseEvent) => {
        
        const mouseX = event.clientX;
        // Get the scroll container element
        const scrollContainer = scrollContainerRef.current;

        if (!draggedTask || !draggedDiv) return;
        console.log("mouse move " + draggedTask.name)
        const element = draggedDiv; 

        if (!element) {
            return;
        }

        console.log('Div element left position:', element.offsetLeft);

        if (scrollContainer) {
            const rect = scrollContainer.getBoundingClientRect();
            const containerLeft = rect.left;

            // Calculate mouse position relative to the scroll container
            const mouseInsideContainer = mouseX - containerLeft + scrollContainer.scrollLeft;

            console.log('Mouse position inside scroll container:', mouseInsideContainer);

            const modulo = mouseInsideContainer % (day * 4);
            const leftNum = mouseInsideContainer - modulo;
            console.log("left px " + leftNum)
            
            element.style.left = `${leftNum}px`; // Update 'left' position
        }
    }

    */

    const handleMouseMove = React.useCallback((event: MouseEvent) => {
        const mouseX = event.clientX;
        const scrollContainer = scrollContainerRef.current;

        if (!draggedDiv || !scrollContainer) {
            //console.log("dragged div empty");
            return;
        }

        const element = draggedDiv as HTMLDivElement;

        const rect = scrollContainer.getBoundingClientRect();
        const containerLeft = rect.left;
        const mouseInsideContainer = mouseX - containerLeft + scrollContainer.scrollLeft;

        const modulo = mouseInsideContainer % (day * 4);
        const leftNum = mouseInsideContainer - modulo;

        element.style.left = `${leftNum}px`;
    }, [draggedDiv, day, scrollContainerRef]);

    const handleMouseUp = React.useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setDragId(-1);

        if (draggedDiv) {

            if (dragId !== -1) {
                const daysAfterStart = (draggedDiv.offsetLeft / (day * 4));
                const editedStartDate = new Date(startDate);
                editedStartDate.setDate(startDate.getDate() + daysAfterStart);
                console.log("NEW DATE: " + formatDateNumericalMMDD(editedStartDate))

                console.log("draggedTask duration " + draggedTask?.duration)
                // Calculate milliseconds to add
                const millisecondsToAdd = draggedTask.duration * 24 * 60 * 60 * 1000;

                // Calculate end date timestamp
                const editedEndDateTimestamp = editedStartDate.getTime() + millisecondsToAdd;

                // Create new Date object from timestamp
                const editedEndDate = new Date();
                editedEndDate.setTime(editedEndDateTimestamp);


                console.log("NEW DATE: " + formatDateNumericalMMDD(editedStartDate) + " - " + formatDateNumericalMMDD(editedEndDate));

                const updatedItem = {
                    ...(draggedTask as Task),
                    'startDate': editedStartDate,
                    'endDate': editedEndDate,

                };

                //console.log("updated item " + formatDateNumericalMMDD(updatedItem.startDate))

                props.updateItem(updatedItem as Task);
            }
            else {
                const daysAfterStart = (draggedDiv.offsetLeft / (day * 4));
                const editedStartDate = new Date(startDate);
                editedStartDate.setDate(startDate.getDate() + daysAfterStart);
                console.log("NEW DATE: " + formatDateNumericalMMDD(editedStartDate))

                const updatedItem = {
                    ...(draggedMilestone as Milestone),
                    'date': editedStartDate,
                };


                props.updateItem(updatedItem as Milestone);
            }
       

        } 

        // Reset draggedTask and draggedDiv states

        setDraggedDiv(null);

    }, [handleMouseMove, draggedDiv, startDate, draggedTask, props.updateItem]);

    const handleMouseDown = (item: Task | Milestone, event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (item.type === 'Task') {
            setDraggedTask(item as Task);
            setDragId(item.id);

        }
        if (item.type === 'Milestone') {
            setDraggedMilestone(item as Milestone);
            setMilestoneDragId(item.id);
        }

        //setDraggedTask(task);
        //console.log("dragged task " + task.name)
        setDraggedDiv(event.currentTarget);
    };


    React.useEffect(() => {
        if (draggedTask) {

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        if (draggedMilestone) {

            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);

            return () => {
                document.removeEventListener('mousemove', handleMouseMove);
                document.removeEventListener('mouseup', handleMouseUp);
            };
        }
        else {
            console.log("dragged item is empty")
        }
    }, [draggedTask, draggedDiv, handleMouseMove, handleMouseUp]);


    // #region Tasks
    let filteredTasks = props.roadmap
        ? props.taskData.filter((task) => {
            const roadmaps = task.roadmaps.map(map => map.name);
            return roadmaps.includes(props.roadmap!.name);
        })
        : props.taskData;

    filteredTasks = props.taskStatus
        ? filteredTasks.filter(task => task.taskStatus.name === props.taskStatus!.name)
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
            borderRadius: '0.5rem',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            zIndex: 20
        };

        return (
            <div key={task.id} style={containerStyles}
                className={`relative ${dragId === task.id ? 'bg-lime-800' : 'bg-gray-400'}`}

                onClick={() => handleClick(task)} onMouseDown={(event => handleMouseDown(task, event))} onMouseUp={() => handleMouseUp()}> 
                <p className={`text-white text-center`}>{task.name}</p>
            </div>
        );
    });
    // #endregion

    // #region Milestones

     let filteredMilestones = selectedTaskStatus
        ? props.milestoneData.filter(milestone => milestone.taskStatus === selectedTaskStatus)
        : props.milestoneData;

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
            <div key={index} style={containerStyles} onClick={() => handleClick(milestone)} onMouseDown={(event => handleMouseDown(milestone, event))} onMouseUp={() => handleMouseUp()}>
                <p className="text-white text-center">{milestone.name}</p>
            </div>
        );
    });
    // #endregion

    // #region Date Range
    // Function to handle date change
    const handleStartDateChange = (event: any) => {
        setSelectedStartDate(event.target.value);
    };
    const handleEndDateChange = (event: any) => {
        setSelectedEndDate(event.target.value);
    };

    // #endregion

    return (
        <div>
            <div className='flex justify-content gap-4'>
                <div className='flex'>
                    <p className='text-white'>START DATE == </p> 
                    <input
                        id="datePicker"
                        type="date"
                        value={selectedStartDate} // Bind the selectedDate state to input value
                        onChange={handleStartDateChange} // Handle date change
                        aria-label="Start Date"
                    />
                </div>

                <div className='flex justify-content gap-4'>
                    <p className='text-white'>END DATE == </p> 
                    <input
                        id="datePicker"
                        type="date"
                        value={selectedEndDate} // Bind the selectedDate state to input value
                        onChange={handleEndDateChange} // Handle date change
                        aria-label="End Date"
                    />
                </div>
              
            </div>

            <div className='7h-full bg-purple-100 relative shrink-0 flex' ref={scrollContainerRef} style={{ width: '2000px' }}>
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
            p</div>
        </div>
    );
};
