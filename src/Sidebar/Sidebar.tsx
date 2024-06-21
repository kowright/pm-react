import React from 'react';
import { Milestone, Task, formatDateNumericalMMDDYYYY } from '../Interfaces';

interface SidebarProps {
    sidebarData: (Milestone | Task | null); //what can show in the sidebar
}

export const Sidebar = ({
    sidebarData = null,
    ...props
}: SidebarProps) => {

    let hideContent: boolean = true;

    let sidebarContent: JSX.Element;

    switch (true) {
        case sidebarData === null:
            sidebarContent = <div>No content to show.</div>;
            hideContent = true;
            break;
        case isMilestone(sidebarData):
            sidebarContent = <div>Milestone data: {sidebarData.name}</div>;
            hideContent = false;
            break;
        case isTask(sidebarData):
            sidebarContent =
            <div>
                  <h1>TASK DETAILS</h1>
                    <p>NAME: {sidebarData.name} </p>
                    <hr />
                    <p>DESCRIPTION: {sidebarData.description} </p>
                    <hr />
                    <p>ROADMAP(S): {sidebarData.roadmap} </p>
                    <hr />
                    <p>ASSIGNEE: {sidebarData.assignee} </p>
                    <hr />
                    <p>START DATE: {formatDateNumericalMMDDYYYY(new Date(sidebarData.startDate))} </p>
                    <hr />
                    <p>END DATE: {formatDateNumericalMMDDYYYY(new Date(sidebarData.endDate))} </p>
                    <hr />
                    <p>DURATION: {sidebarData.duration} </p>
                    <hr />
                    <p>TASK STATUS: {sidebarData.taskStatus} </p>
                    <hr />
                    <p>ID: {sidebarData.id} </p>
                </div>;
            hideContent = false;
            break;
        default:
            sidebarContent = <div>Unknown data type.</div>;
            hideContent = false;
            break;
    }
    function isMilestone(data: Milestone | Task | null): data is Milestone {
        return (data as Milestone).date !== undefined;
    }

    function isTask(data: Milestone | Task | null): data is Task {
        return (data as Task).duration !== undefined;
    }

    return (
        <div>
            {!hideContent &&
                 <div className='w-full h-full bg-rose-700'>
                    {sidebarContent }
                </div> 
            }
        </div>
    );
};
