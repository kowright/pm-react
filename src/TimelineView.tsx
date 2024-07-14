import React from "react";
import { Timeline } from './Timeline/Timeline';
import { Task, Milestone, Roadmap, TaskStatus, Tag, Assignee, findIdForUnitType, UnitType } from './Interfaces';

export interface TimelineViewProps {
    taskClick: (task: Task | Milestone) => void;
    taskData: Task[];
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;
    unitTypeData: UnitType[];
    roadmapFilterState: string[];
    taskStatusFilterState: string[];
    //give selected Item
}

export const TimelineView = ({
        ...props
}: TimelineViewProps) => {

    return (
        <div>
            <br />
            <Timeline taskClick={props.taskClick} taskData={props.taskData} milestoneData={props.milestoneData} updateItem={props.updateItem} unitTypeData={props.unitTypeData} taskStatusFilterState={props.taskStatusFilterState} roadmapFilterState={props.roadmapFilterState} />
        </div>
    );
};

export default TimelineView;
