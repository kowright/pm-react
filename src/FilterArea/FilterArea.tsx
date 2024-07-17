import React from 'react';
import { Milestone, Roadmap, TaskStatus, Unit, colorSets } from '../Interfaces';
import { FilterButton } from '../FilterButton';
interface FilterAreaProps {
    selectedRoadmap: Roadmap | null;
    selectedTaskStatus: TaskStatus | null;
    roadmapData: Roadmap[];
    taskStatusData: TaskStatus[];
    handleFilterByRoadmap: (roadmap: Roadmap) => void;
    handleFilterByTaskStatus: (taskStatus: TaskStatus) => void;
    roadmapFilterState: string[];
    taskStatusFilterState: string[];

}

export const FilterArea = ({
    ...props
}: FilterAreaProps) => {

/*    const [roadmapData, setRoadmapData] = React.useState< Roadmap[]  | null>(null);
    const [taskStatusData, setTaskStatusData] = React.useState< TaskStatus[]  | null>(null);
*/
    //const [roadmapFilterState, setRoadmapFilterState] = React.useState<string[]>([]);

  /*  React.useEffect(() => {
        fetch("/api/taskstatus")
            .then((res) => res.json())
            .then((data) => {
                console.log("status api")
                setTaskStatusData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);*/

   /* React.useEffect(() => {
        fetch("/api/roadmaps")
            .then((res) => res.json())
            .then((data) => {
                setRoadmapData(data);
                //console.log("roadmapss ", (data as Roadmap[])?.map(map => map.name))
                //setRoadmapFilterState((data as Roadmap[])?.map(map => map.name));
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);*/

    if (!props.taskStatusData || !props.roadmapData) {
        return <div> oh no dude</div>
    };

    /*let roadmapButtons = roadmapData.map(roadmap =>
        <FilterButton text={roadmap.name} key={roadmap.id} onClick={() => props.handleFilterByRoadmap(roadmap)} ></FilterButton>
    );*/

   /* const handleRoadmapFilterClick = (roadmapName: string) => {
        console.log("clicked " + roadmapName)
        if (roadmapFilterState.includes(roadmapName)) {
            console.log("take out " + roadmapName )
            setRoadmapFilterState(prev => prev.filter(map => map !== roadmapName));
        }
        else {
            console.log("add " + roadmapName)
            setRoadmapFilterState(prev => [...prev, roadmapName]); 
        }
    };*/




/*    const PMButtonNull = (active: boolean, text: string) => {
        return (
            <button className={`h-[25px] w-fit bg-ash-gray rounded-lg flex justify-center items-center text-white shrink-0 p-2
                ${active ? 'bg-dark-moss-green' : 'bg-ash-gray'}`} onClick={() => props.selectedRoadmap && props.handleFilterByRoadmap(null)}>
                {text}
                {active && <div className='ml-2 flex items-center'>X</div>}
            </button>
        );
    }*/
    const PMButton = (item: Unit) => {
        const isRoadmap = item.type === 5;

        const color = colorSets['green'];

        return (
            <button key={item.id}
                className={`h-[25px] w-fit bg-ash-gray rounded-lg flex justify-center items-center shrink-0 p-2 ${color.hover} ${color.focusRing} focus:ring-offset-alabaster
            ${isRoadmap ? props.roadmapFilterState.includes(item.name) ? color.selected : color.default : props.taskStatusFilterState.includes(item.name) ? color.selected : color.default}`}
                onClick={() => {
                    isRoadmap ? props.handleFilterByRoadmap(item as Roadmap) : props.handleFilterByTaskStatus(item as TaskStatus);
                }}
            >
                {item.name}
                {isRoadmap ? props.roadmapFilterState.includes(item.name) && <div className='ml-2 flex items-center'>X</div> : props.taskStatusFilterState.includes(item.name) && <div className='ml-2 flex items-center'>X</div>}
            </button>
        );
    };

    let pmRoadmapButtons = props.roadmapData.map(roadmap =>
        PMButton(roadmap)
    );
    let pmTaskStatusButtons = props.taskStatusData?.map(status =>
        PMButton(status)
    );


    return (
        <div className='flex gap-x-4 gap-y-2 flex-wrap'>
   {/*         {roadmapButtons}
            <FilterButton text='All Roadmaps' onClick={() => props.selectedRoadmap && props.handleFilterByRoadmap(null)} ></FilterButton>*/}

            {pmRoadmapButtons}
            {pmTaskStatusButtons}

{/*            {taskStatusButtons}
            <FilterButton text='All Task Statuses' onClick={() => props.selectedTaskStatus && props.handleFilterByTaskStatus(null)} ></FilterButton>*/}
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


