import React from "react";
import { Assignee, Milestone, Tag, Task, ViewData } from "../utils/models";
import { filterMilestones, filterTasks, sortMilestones, sortTasks, } from "../utils/filterSorts";
import { formatDateWords } from "../utils/helpers";
import { colorSets } from "../utils/colors";
import FilterButton from "../components/FilterButton";
import { SortArea } from "../components/SortArea";
import AssigneeProfileImage from '../components/AssigneeProfile';

interface KanbanViewProps {
    milestoneData: Milestone[];
    viewData: ViewData;
}

export const KanbanView = ({
    viewData: { filterStates, selectedItem, taskData, unitClick, unitTypeData, setShowFilterAreaAssignees },
        ...props
    }: KanbanViewProps) => {

    const [kanbanDataType, setKanbanDataType] = React.useState("Task");
    const [taskSortState, setTaskSortState] = React.useState<string[]>([]);
    const [milestoneSortState, setMilestoneSortState] = React.useState<string[]>([]);
      const [sortStates, setSortStates] = React.useState({
        taskSortState: taskSortState,
        milestoneSortState: milestoneSortState
    });

    React.useEffect(() => {
        if (kanbanDataType === "Task") {
            setShowFilterAreaAssignees(true);
        }
        else {//milestones
            setShowFilterAreaAssignees(false);
        }
    }, [kanbanDataType, setShowFilterAreaAssignees]);

     const handleClick = (task: Task | Milestone | Tag | Assignee) => {
         unitClick(task); 
     };

     let filteredTasks = taskData;
     let filteredMilestones = props.milestoneData;
     let statusColumns;
     const color = colorSets['blueWhite'];

        const handleSort = (sort: string) => {
        if (kanbanDataType === 'Task') {
            if (taskSortState.includes(sort)) {
                setTaskSortState([]);
                //this sort is already in
            } else {
                setTaskSortState([sort]);
                //other sort is in or there is no sort yet
            }
        } else { // milestones
            if (milestoneSortState.includes(sort)) {
                setMilestoneSortState([]);
            } else {
                setMilestoneSortState([sort]);
            }
        }
    };

    React.useEffect(() => {
        setSortStates({
            taskSortState: taskSortState,
            milestoneSortState: milestoneSortState
        });
    }, [milestoneSortState, taskSortState]);

    let tasksByTaskStatus: Record<string, Task[]>;
    let tasksByMilestoneStatus: Record <string, Milestone[]>;

    if (kanbanDataType === 'Task') {
        
        filteredTasks = filterTasks(taskData, filterStates);

        filteredTasks = sortTasks(filteredTasks, sortStates);

       tasksByTaskStatus = filteredTasks.reduce((acc: Record<string, Task[]>, task: Task) => {
            const status = task.taskStatus.name;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(task);
            return acc;
        }, {});

        statusColumns = Object.keys(tasksByTaskStatus).map(key =>
            tasksByTaskStatus[key]?.map((task, index) => (
                <div key={task.id} onClick={() => handleClick(task)} className={`cursor-pointer relative ${color.focusRing} ${color.hover} rounded-xl flex flex-col justify-center w-[320px] gap-1 p-2
               ${selectedItem?.id === task.id ? color.selected : color.default} `}>
                    <div className='absolute right-0 top-0 mt-2 mr-2'>
                        <AssigneeProfileImage imageId={task.assignee.imageId} />
                    </div>

                    <div className='text-lg font-bold'> {task.name}</div>
                    <div className='text-sm'>{task.description}</div>
                    <div className='text-sm'>{formatDateWords(new Date(task.startDate))} - {formatDateWords(new Date(task.endDate))}</div>
                    <div className='w-auto flex justify-start gap-x-2'>
                        {task.tags.map(tag =>
                            <FilterButton text={tag.name} colorByType='Tag' />
                        )}
                        {task.roadmaps.map(map =>
                            <FilterButton text={map.name} colorByType='Roadmap' />
                        )}
                    </div>
                </div>
            )));
    } else {

        filteredMilestones = filterMilestones(props.milestoneData, filterStates);

        filteredMilestones = sortMilestones(filteredMilestones, sortStates);
      

        tasksByMilestoneStatus = filteredMilestones.reduce((acc: Record<string, Milestone[]>, ms: Milestone) => {
            const status = ms.taskStatus.name;
            if (!acc[status]) {
                acc[status] = [];
            }
            acc[status].push(ms);
            return acc;
        }, {});

        statusColumns = Object.keys(tasksByMilestoneStatus).map(key =>
            tasksByMilestoneStatus[key]?.map((ms, index) => (
                <div key={ms.id} onClick={() => handleClick(ms)} className={`cursor-pointer relative ${color.focusRing} ${color.hover} rounded-xl flex flex-col justify-center w-[320px] gap-1 p-2
               ${selectedItem?.id === ms.id ? color.selected : color.default} `}>
                    <div className='absolute right-0 top-0 mt-2 mr-2'>
                        <img className='ml-2 w-[34px] rounded-full' src="https://www.hartz.com/wp-content/uploads/2022/04/small-dog-owners-1.jpg" alt="Doggo" />
                    </div>

                    <div className='text-lg font-bold'> {ms.name}</div>
                    <div className='text-sm'>{ms.description}</div>
                    <div className='text-sm'>{formatDateWords(new Date(ms.date))}</div>
                    <div className='w-auto flex justify-start gap-x-2'>
                        {ms.tags.map(tag =>
                            <FilterButton text={tag.name} colorByType='Tag' />
                        )}
                        {ms.roadmaps.map(map =>
                            <FilterButton text={map.name} colorByType='Roadmap' />
                        )}
                    </div>
                </div>
            )));
    }
   

    return (
        <div>
            <br />
            <div className='flex gap-4 justify-center'>
                <FilterButton text='Task' onClick={() => setKanbanDataType("Task")} active={kanbanDataType === 'Task'} showX={false} />
                <FilterButton text='Milestone' onClick={() => setKanbanDataType("Milestone")} active={kanbanDataType === 'Milestone'} showX={false} />
            </div>
            <br/>
            <SortArea unitOfSort={kanbanDataType} sortState={sortStates} handleSort={handleSort} />

            <br/>
            <div className='flex gap-4'>
                <div className='flex gap-4'>
                    {kanbanDataType === 'Task' && statusColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col space-y-4">
                            <h1 className="text-xl text-smoky-black text-center font-bold">{Object.keys(tasksByTaskStatus)[columnIndex]}</h1>
                            {column}
                        </div>
                    ))}
                    {kanbanDataType === 'Milestone' && statusColumns.map((column, columnIndex) => (
                        <div key={columnIndex} className="flex flex-col space-y-4">
                            <h1 className="text-xl text-smoky-black text-center font-bold">{Object.keys(tasksByMilestoneStatus)[columnIndex]}</h1>
                            {column}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default KanbanView;
