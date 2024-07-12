import React from "react";
import { Timeline } from './Timeline/Timeline';
import { Task, Milestone, Roadmap, TaskStatus, Tag, Assignee, findIdForUnitType, UnitType } from './Interfaces';

export interface TimelineViewProps {
    taskClick: (task: Task | Milestone) => void;
    roadmap: Roadmap | null; //group filter properties together
    taskStatus: TaskStatus | null;
    taskData: Task[];
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;
    unitTypeData: UnitType[];
    roadmapFilterState: string[];
    taskStatusFilterState: string[];
}

export const TimelineView = ({
        ...props
}: TimelineViewProps) => {

    return (
        <div>
            <br />
            <Timeline taskClick={props.taskClick} roadmap={props.roadmap} taskStatus={props.taskStatus} taskData={props.taskData} milestoneData={props.milestoneData} updateItem={props.updateItem} unitTypeData={props.unitTypeData} taskStatusFilterState={props.taskStatusFilterState} roadmapFilterState={props.roadmapFilterState} />
        </div>
    );
};

export default TimelineView;
