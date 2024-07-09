import React from 'react';
import { Roadmap, TaskStatus } from '../Interfaces';
import { FilterButton } from '../FilterButton';
interface FilterAreaProps {
    selectedRoadmap: Roadmap | null;
    selectedTaskStatus: TaskStatus | null;
    handleFilterByRoadmap: (roadmap: Roadmap | null) => void;
    handleFilterByTaskStatus: (roadmap: TaskStatus | null) => void;
}

export const FilterArea = ({
    ...props
}: FilterAreaProps) => {

    const [roadmapData, setRoadmapData] = React.useState< Roadmap[]  | null>(null);
    const [taskStatusData, setTaskStatusData] = React.useState< TaskStatus[]  | null>(null);

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

    let roadmapButtons = roadmapData.map(roadmap =>
        <FilterButton text={roadmap.name} key={roadmap.id} onClick={() => props.handleFilterByRoadmap(roadmap)} ></FilterButton>
    );
    let taskStatusButtons = taskStatusData?.map(status =>
        <FilterButton text={status.name} key={status.id} onClick={() => props.handleFilterByTaskStatus(status)} ></FilterButton>
    );
  
    return (
        <div className='flex gap-x-4 gap-y-2 flex-wrap'>
            {roadmapButtons}
            <FilterButton text='All Roadmaps' onClick={() => props.selectedRoadmap && props.handleFilterByRoadmap(null)} ></FilterButton>
            {taskStatusButtons}
            <FilterButton text='All Task Statuses' onClick={() => props.selectedTaskStatus && props.handleFilterByTaskStatus(null)} ></FilterButton>
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
/*
               <div className='flex gap-4 justify-center'>
                {roadmapButtons}
                <button className={`rounded border border-cyan-200 p-2 ${props.selectedRoadmap?.name == null ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => props.selectedRoadmap && props.handleFilterByRoadmap(null)}>All Roadmaps</button>
            </div>
            <div className='flex gap-4 justify-center'>
                {taskStatusButtons}
                <button className={`rounded border border-cyan-200 p-2 ${props.selectedTaskStatus?.name == null ? "bg-cyan-800" : "bg-cyan-400"}`} onClick={() => props.selectedTaskStatus && props.handleFilterByTaskStatus(null)}>All Statuses</button>
            </div>*/


