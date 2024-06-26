import React from "react";
import { Timeline } from './Timeline/Timeline';
import { Task, Milestone, Roadmap, TaskStatus, Tag, Assignee } from './Interfaces';

export interface TimelineViewProps {
    taskClick: (task: Task | Milestone) => void;
    roadmap: Roadmap | null; //group filter properties together
    taskStatus: TaskStatus | null;
    taskData: Task[];
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;
}

export const TimelineView = ({
        ...props
}: TimelineViewProps) => {

    return (
        <div>
            <br />
            <p className='flex justify-center text-3xl text-white'>TIMELINE VIEW</p>
            <br />
            <Timeline taskClick={props.taskClick} roadmap={props.roadmap} taskStatus={props.taskStatus} taskData={props.taskData} milestoneData={props.milestoneData} updateItem={props.updateItem} />
        </div>
    );
};

export default TimelineView;
