import React from 'react';
import { Assignee, Milestone, Tag, Task, ViewData } from "../utils/models";
import { filterMilestones, filterTasks} from "../utils/filterSorts";
import { findIdForUnitType, formatDateNumericalMMDD } from "../utils/helpers";
import { colorSets } from '../utils/colors';

interface TimelineProps {
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;
    viewData: ViewData;
}

export const Timeline = ({
    viewData: { filterStates, selectedItem, taskData, unitClick, unitTypeData, setShowFilterAreaAssignees },
    ...props
}: TimelineProps) => {
    const day = 15; // Size of cell in pixels
    const cell = day * 4; 

    const handleClick = (task: Task | Milestone) => {
        unitClick(task);
    };
    const [caretDirection, setCaretDirection] = React.useState<string>('');
    const [selectedStartDate, setSelectedStartDate] = React.useState('2024-06-01');
    const [selectedEndDate, setSelectedEndDate] = React.useState('2024-09-01');

    const [draggedTask, setDraggedTask] = React.useState<Task>(taskData[0]);
    const [draggedMilestone, setDraggedMilestone] = React.useState<Milestone>(props.milestoneData[0]);

    const scrollContainerRef = React.useRef<HTMLDivElement>(null);
    const [draggedDiv, setDraggedDiv] = React.useState<HTMLDivElement | null>(null);
    const [dragId, setDragId] = React.useState<number>(-1)
    const [milestoneDragId, setMilestoneDragId] = React.useState<number>(-1);

    const color = colorSets['blueLite'];

    // #region Table
    // Table Header Styles
    const tableHeaderStyle: React.CSSProperties = {
        width: `${cell}px`,
        height: `${(day / 2) * 4}px`,
        border: '0.5px solid',
        textAlign: 'center'
    };

    const formatDayOfWeek = (date: Date): string => {
        const daysOfWeek = ['Sun', 'Mon', 'Tues', 'Wed', 'Thurs', 'Fri', 'Sat'];
        return daysOfWeek[date.getDay()]
    };

    let numberedDateElements: JSX.Element[] = [];
    let dayOfWeekDateElements: JSX.Element[] = [];
    const startDate = new Date(selectedStartDate); 
    const endDate = new Date(selectedEndDate);

    const adjustedStartDate = new Date(startDate);
    adjustedStartDate.setDate(startDate.getDate() + 1);

    const adjustedEndDate = new Date(endDate);
    adjustedEndDate.setDate(endDate.getDate() + 1);

    for (let currentDate = adjustedStartDate; currentDate <= adjustedEndDate; currentDate.setDate(currentDate.getDate() + 1)) {
        numberedDateElements.push(<th key={currentDate.toISOString()} className={`${color.selected} font-normal`} style={tableHeaderStyle}>{formatDateNumericalMMDD(currentDate)}</th>);
        dayOfWeekDateElements.push(<th key={currentDate.toISOString()} className={`bg-yinmn-blue text-white font-normal	`} style={tableHeaderStyle}>{formatDayOfWeek(currentDate)}</th>);
    }

    const tableRowStyle: React.CSSProperties = {
        width: `${cell}px`,
        height: `${cell}px`,
        border: '0.5px solid #6C8FAB',
        textAlign: 'center'
    };

    const createRows = (numRows: number, numColumns: number = numberedDateElements.length): JSX.Element[] => {
        let tableRows: JSX.Element[] = [];
        for (let i = 0; i < numRows; i++) {
            let tableCells: JSX.Element[] = [];
            for (let j = 0; j < numColumns; j++) {
                tableCells.push(
                    <td key={`row-${i}-col-${j}`} style={tableRowStyle}></td>
                );
            }
            tableRows.push(
                <tr key={`row-${i}`} className={`${color.default}`}>
                    {tableCells}
                </tr>
            );
        }
        return tableRows;
    };
    // #endregion

    // #region Mouse Events

    const handleMouseMove = React.useCallback((event: MouseEvent) => {
        const mouseX = event.clientX;
        const scrollContainer = scrollContainerRef.current;

        if (!draggedDiv || !scrollContainer) {
            return;
        }

        const element = draggedDiv as HTMLDivElement;

        const rect = scrollContainer.getBoundingClientRect();
        const containerLeft = rect.left;
        const mouseInsideContainer = mouseX - containerLeft + scrollContainer.scrollLeft;

        const modulo = mouseInsideContainer % cell;
        const leftNum = mouseInsideContainer - modulo;


        if (caretDirection === 'left') { //make sure duration can't be less zero
            element.style.left = `${leftNum}px`;

            let startOffset = Math.round((new Date(draggedTask.startDate).getTime() - startDate.getTime()) / (1000 * 3600 * 24));

            const newDuration = (draggedTask.duration + ((startOffset * 60) - leftNum) / 60)
            element.style.width = `${newDuration * 60}px`;
        }
        if (caretDirection === 'right') { //make sure duration can't be less zero

            const modulus = (mouseX - containerLeft) % cell;
            console.log("modulo " + modulus)
            const nextBlock = (mouseX - containerLeft) - modulus;
            console.log("next block " + nextBlock);
            const computedStyle = getComputedStyle(element);
            const leftStyleValue = computedStyle.left;

            const currentLeft = parseFloat(leftStyleValue);
            const newWidth = nextBlock - currentLeft;
            console.log('hm ' + newWidth + " px");

            //element.style.width = `${3 * 60}px`; //moves back

            //const newDuration = (draggedTask.duration + ((startOffset * 60) - leftNum) / 60)
            element.style.width = `${newWidth}px`;
            //console.log('new duration ' + newDuration);
            //draggedTask.duration = newDuration
        }
        else {
            element.style.left = `${leftNum}px`; //still needed for middle change

        }



    }, [draggedDiv, day, scrollContainerRef]);

    const handleMouseUp = React.useCallback(() => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        setDragId(-1);

        if (draggedDiv) {

            if (dragId !== -1) {

              

                const daysAfterStart = (draggedDiv.offsetLeft / cell);
                const editedStartDate = new Date(startDate);
                editedStartDate.setDate(startDate.getDate() + daysAfterStart);
  
                let millisecondsToAdd = draggedTask.duration * 24 * 60 * 60 * 1000; //make conditional calc

                if (caretDirection !== '') {
                    console.log('duration mouse up ' + draggedTask.duration);
                    const editedDuration = (draggedDiv.offsetWidth) / 60;
                    console.log('calc duration ' + editedDuration)
                    millisecondsToAdd = editedDuration * 24 * 60 * 60 * 1000;
                    setCaretDirection('');

                }
             /*   if (caretDirection === 'right') {
                  console.log('duration mouse up ' + draggedTask.duration);
                    const editedDuration = (draggedDiv.offsetWidth) / 60;
                    console.log('calc duration ' + editedDuration)
                    millisecondsToAdd = editedDuration * 24 * 60 * 60 * 1000;

                }*/

                const editedEndDateTimestamp = editedStartDate.getTime() + millisecondsToAdd;

                const editedEndDate = new Date();
                editedEndDate.setTime(editedEndDateTimestamp);

                const updatedItem = {
                    ...(draggedTask as Task),
                    'startDate': editedStartDate,
                    'endDate': editedEndDate,

                };


                console.log('start date ' + editedStartDate + ' - ' + editedEndDate);
                setCaretDirection('');

                props.updateItem(updatedItem as Task);
            }
            else {
                const daysAfterStart = (draggedDiv.offsetLeft / cell );
                const editedStartDate = new Date(startDate);
                editedStartDate.setDate(startDate.getDate() + daysAfterStart);

                const updatedItem = {
                    ...(draggedMilestone as Milestone),
                    'date': editedStartDate,
                };

                props.updateItem(updatedItem as Milestone);
            }
        } 

        setDraggedDiv(null);

    }, [handleMouseMove, draggedDiv, startDate, draggedTask, props.updateItem]);

    const handleMouseDown = (item: Task | Milestone, event: React.MouseEvent<HTMLDivElement>) => {
        event.preventDefault();

        if (item.type === findIdForUnitType('Task', unitTypeData)) {
            setDraggedTask(item as Task);
            setDragId(item.id);

        }
        if (item.type === findIdForUnitType('Milestone', unitTypeData)) {
            setDraggedMilestone(item as Milestone);
            setMilestoneDragId(item.id);
        }

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

    // #endregion

    // #region Tasks

    let filteredTasks = filterTasks(taskData, filterStates);
    filteredTasks = filteredTasks.filter((task) => new Date(task.startDate) <= endDate);

    const taskColors = colorSets['yellow'];

    let tasks = filteredTasks.map((task, index) => {
        let top = `${cell * (index + 1) }px`;
        let lengthRange = Math.round((endDate.getTime() - new Date(task.endDate).getTime()) / (1000 * 3600 * 24));
        let width = lengthRange < 0 ? `${cell * (task.duration + lengthRange + 1) }px` : `${cell * task.duration}px`;

        let startOffset = Math.round((new Date(task.startDate).getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        let left = `${cell * startOffset}px`;

        const containerStyles: React.CSSProperties = {
            position: 'absolute',
            left: left,
            top: top,
            width: width,
            height: `${cell}px`,
            borderRadius: '0.5rem',
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            zIndex: 20
        };
        const leftCaret = '<';
        const rightCaret = '>';

        return (
            <div key={task.id} style={containerStyles}
                className={`relative group ${taskColors.hover} ${selectedItem?.type === findIdForUnitType('Task', unitTypeData) && selectedItem?.id === task.id ? taskColors.selected : taskColors.default }`}

                onClick={() => handleClick(task)} onMouseDown={(event => handleMouseDown(task, event))} onMouseUp={() => handleMouseUp()}> 
                <div className='flex justify-between'>
                    <div className={`bg-lime-400 w-4 flex justify-center items-center invisible group-hover:visible ${caretDirection === 'left' ? 'visible bg-lime-600 group-hover:visible' : ''}`}
                        onClick={(e) => {
                        e.stopPropagation(); 
                        setCaretDirection('left');
                    }}
                    >
                        {leftCaret}
                    </div>

                    <div>
                        <p className={`text-center`}>{task.name}</p>
                    </div>

                    <div className={`bg-lime-400 w-4 flex justify-center items-center invisible group-hover:visible ${caretDirection === 'right' ? 'visible bg-lime-600 group-hover:visible' : ''}`}
                        onClick={(e) => {
                        e.stopPropagation();
                            setCaretDirection('right');
                    }}
                    >
                        {rightCaret}
                    </div>

                </div>
            </div>
        );
    });
    // #endregion

    // #region Milestones

    let filteredMilestones = filterMilestones(props.milestoneData, filterStates);

    filteredMilestones = filteredMilestones.filter(milestone => new Date(milestone.date) <= endDate);
    const milestoneColors = colorSets['red'];

    let milestones = filteredMilestones.map((milestone, index) => {
        let width = `${cell}px`;
        let top = `${cell}px`;
        let height = `${cell * filteredTasks.length}px`;

        let dateRange = Math.round((new Date(milestone.date).getTime() - startDate.getTime()) / (1000 * 3600 * 24));
        let left = `${cell * dateRange}px`;

        const containerStyles: React.CSSProperties = {
            position: 'absolute',
            left: left,
            top: top,
            overflow: 'hidden',
            width: width,
            height: height,
            borderRadius: '0.375rem',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            zIndex: 30
        };

        return (
            <div key={index} style={containerStyles} className={`${milestoneColors.hover} ${selectedItem?.type === findIdForUnitType('Milestone', unitTypeData) && selectedItem?.id === milestone.id ? milestoneColors.selected : milestoneColors.default}`}
                onClick={() => handleClick(milestone)} onMouseDown={(event => handleMouseDown(milestone, event))} onMouseUp={() => handleMouseUp()}>
                <p className={`text-center`}>{milestone.name}</p>
            </div>
        );
    });
    // #endregion

    // #region Date Range

    const handleStartDateChange = (event: any) => {
        setSelectedStartDate(event.target.value);
    };
    const handleEndDateChange = (event: any) => {
        setSelectedEndDate(event.target.value);
    };

    // #endregion

    return (
        <div className='flex flex-col flex-1 overflow-auto'>

            <div className='flex justify-start text-smoky-black gap-4'>
                <div className='flex gap-2'>
                    <p className={`text-smoky-black font-bold `}>START DATE  </p> 
                    <input className='rounded-xl pl-2 pr-2'
                        id="datePicker"
                        type="date"
                        value={selectedStartDate} 
                        onChange={handleStartDateChange}
                        aria-label="Start Date"
                    />
                </div>
                <div className='flex gap-2'>
                    <p className='text-smoky-black font-bold'>END DATE</p> 
                    <input className='rounded-xl pl-2 pr-2'
                        id="datePicker"
                        type="date"
                        value={selectedEndDate} 
                        onChange={handleEndDateChange} 
                        aria-label="End Date"
                    />
                </div>
              
            </div>
            <br />
            <div className='7h-full bg-purple-100 relative shrink-0 flex' ref={scrollContainerRef} style={{ width: '2000px' }}>
                {milestones}
                {tasks}
                <table className="border-collapse shrink-0 z-0">
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

