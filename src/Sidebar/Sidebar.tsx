import React from 'react';
import { Milestone, Task, Tag, Assignee, formatDateNumericalMMDDYYYY } from '../Interfaces';

interface SidebarProps {
    sidebarData: Task | Milestone | Tag | Assignee | null; //what can show in the sidebar; ADD EVERYTHING ELSE
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
            const milestoneData = sidebarData as Milestone; 
            sidebarContent = (
                <div>
                    <h1>MILESTONE DETAILS</h1>
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
        case "Tag":
            const tagData = sidebarData as Tag; 
            sidebarContent = (
                <div>
                    <h1>TAG DETAILS</h1>
                    <p>NAME: {tagData.name} </p>
                    <hr />
                    <p>DESCRIPTION: {tagData.description} </p>
                    <hr />
                    <p>ID: {tagData.id} </p>
                </div>
            );

            break;
        case "Assignee":
            const assigneeData = sidebarData as Assignee;
            sidebarContent = (
                <div>
                    <h1>ASSIGNEE DETAILS</h1>
                    <p>NAME: {assigneeData.name} </p>
                    <hr />
                    <p>DESCRIPTION: {assigneeData.description} </p>
                    <hr />
                    <p>ID: {assigneeData.id} </p>
                </div>
            );

            break;
    }

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
