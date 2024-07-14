import React from "react";
import { Timeline } from './Timeline/Timeline';
import { Task, Milestone, Roadmap, TaskStatus, Tag, Assignee, findIdForUnitType, UnitType, ViewData } from './Interfaces';

export interface TimelineViewProps {
    //taskClick: (task: Task | Milestone) => void;
    //taskData: Task[];
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;
    //unitTypeData: UnitType[];
    //roadmapFilterState: string[];
    //taskStatusFilterState: string[];
    viewData: ViewData;
}

export const TimelineView = ({
        ...props
}: TimelineViewProps) => {

    return (
        <div>
            <br />
            <Timeline viewData={props.viewData} milestoneData={props.milestoneData} updateItem={props.updateItem} />
        </div>
    );
};

export default TimelineView;
