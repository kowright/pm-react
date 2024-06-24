import React from 'react';
import { Milestone, Task, formatDateNumericalMMDDYYYY } from '../Interfaces';

interface SidebarProps {
    sidebarData: Task | Milestone | null; //what can show in the sidebar; ADD EVERYTHING ELSE
}

export const Sidebar = ({
    sidebarData = null,
    ...props
}: SidebarProps) => {

    let hideContent: boolean = true;
    let sidebarContent: JSX.Element;

    console.log("sidebar data ", sidebarData)
    sidebarContent = <div>NAHHHHHHHHHHHHHHHHH</div>
        
    if (sidebarData == null) {
        return <div>No details to display</div>
  
    }

    hideContent = false;

    switch (sidebarData.type) {
        case "Task":

            const taskData = sidebarData as Task; // Type assertion
            sidebarContent = (
                <div>
                    <h1>TASK DETAILS</h1>
                    <p>NAME: {taskData.name} </p>
                    <hr />
                    <p>DESCRIPTION: {taskData.description} </p>
                    <hr />
                    <p>ASSIGNEE: {taskData.assignee.name} </p> {/* Accessing taskData.assignee.name */}
                    <hr />
                    <p>START DATE: {formatDateNumericalMMDDYYYY(new Date(taskData.startDate))} </p>
                    <hr />
                    <p>END DATE: {formatDateNumericalMMDDYYYY(new Date(taskData.endDate))} </p>
                    <hr />
                    <p>DURATION: {taskData.duration} </p>
                    <hr />
                    <p>TASK STATUS: {taskData.taskStatus.name} </p>
                    <hr />
                    <p>ID: {taskData.id} </p>
                </div>
            );
            break;
        case "Milestone":
            const milestoneData = sidebarData as Milestone; // Type assertion
            sidebarContent = (
                <div>
                    <h1>milestone DETAILS</h1>
                    <p>NAME: {milestoneData.name} </p>
                    <hr />
                    <p>DESCRIPTION: {milestoneData.description} </p>
                    <hr />
                    <p>DATE: {formatDateNumericalMMDDYYYY(new Date(milestoneData.date))} </p>
                    <hr />
                    <p>ID: {milestoneData.id} </p>
                </div>
            );

            break;
    }
    
    /*
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
    }*/

    return (
        <div className='bg-white'>
            {!hideContent &&
                sidebarContent
            }
        </div>
    );
};



//add more types to be shown in sidebar - probably should make a single type for it, put in interfaces and use everywhere
//make it so people can change anything in sidebar and type in it
//make it so it can be closed
//get rid of cell numbers
//make it so you can change the date range on page
