import React from "react";
import { Assignee, Milestone, Tag, Task, ViewData } from "../utils/models";
import { Timeline } from "../components/Timeline";

export interface TimelineViewProps {
    milestoneData: Milestone[];
    updateItem: (task: Task | Milestone | Tag | Assignee) => void;
    viewData: ViewData;
}

export const TimelineView = ({
        ...props
}: TimelineViewProps) => {

    return (
        <div className='flex flex-col flex-1 overflow-auto'>
            <br />
            <Timeline viewData={props.viewData} milestoneData={props.milestoneData} updateItem={props.updateItem} />
        </div>
    );
};

export default TimelineView;
