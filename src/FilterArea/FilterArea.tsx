import React from 'react';
import { Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY } from '../Interfaces';

interface FilterAreaProps {
    selectedRoadmap: Roadmap | null;
    selectedTaskStatus: TaskStatus | null;
    handleFilterByRoadmap: (roadmap: Roadmap | null) => void;
    handleFilterByTaskStatus: (roadmap: TaskStatus | null) => void;
}

export const FilterArea = ({
    ...props
}: FilterAreaProps) => {

    const [roadmapData, setRoadmapData] = React.useState<{ message: Roadmap[] } | null>(null);
    const [taskStatusData, setTaskStatusData] = React.useState<{ message: TaskStatus[] } | null>(null);

    React.useEffect(() => {
        fetch("/api/taskstatus")
            .then((res) => res.json())
            .then((data) => setTaskStatusData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    React.useEffect(() => {
        fetch("/api/roadmaps")
            .then((res) => res.json())
            .then((data) => setRoadmapData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    if (!taskStatusData || !roadmapData) {
        return <div> oh no dude</div>
    };

    let roadmapButtons = roadmapData.message.map(roadmap =>
        <button className={`rounded border border-cyan-200 p-2 ${props.selectedRoadmap?.name === roadmap.name ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => props.handleFilterByRoadmap(roadmap)}>{roadmap.name}</button>
    );
    console.log("filter area " + props.selectedTaskStatus)
    let taskStatusButtons = taskStatusData?.message.map(status =>
        <button className={`rounded border border-cyan-200 p-2 ${props.selectedTaskStatus?.name === status.name ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={ () => props.handleFilterByTaskStatus(status) } >{status.name}</button>

    );
  
    return (
        <div className='flex flex-col gap-4 '>
            <div className='flex gap-4 justify-center'>
                {roadmapButtons}
                <button className={`rounded border border-cyan-200 p-2 ${props.selectedRoadmap?.name == null ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => props.selectedRoadmap && props.handleFilterByRoadmap(null)}>All Roadmaps</button>
            </div>
            <div className='flex gap-4 justify-center'>
                {taskStatusButtons}
                <button className={`rounded border border-cyan-200 p-2 ${props.selectedTaskStatus?.name == null ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => props.selectedTaskStatus && props.handleFilterByTaskStatus(null)}>All Statuses</button>
            </div>
        </div>
    );
};

/*//Filter Area Necessities
const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null); //keep
const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null); //keep
const handleFilterByRoadmap = (roadmap: Roadmap | null) => { //keep
    setSelectedRoadmap(roadmap);
};
const handleFilterByTaskStatus = (status: TaskStatus | null) => { //keep
    setSelectedTaskStatus(status);
};
*/