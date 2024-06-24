import React from "react";
import { Timeline } from './Timeline/Timeline';
import { Task, Milestone } from './Interfaces';

export interface TimelineViewProps {
    taskClick: (task: Task | Milestone) => void;
}

export const TimelineView = ({
        ...props
}: TimelineViewProps) => {


/*
    const updateTask = (item) => {
        fetch(`/api/tasks/${item.id-1}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: item.name, startDate: item.start_date, duration: item.duration }),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated task:', data.task);
                // Update state immutably
          *//*      setData(prev => ({
                    ...prev,
                    message: prev.message.map(task => {
                        if (task.id === (item.id - 1)) {
                            console.log("Found updated item; changing " + data.task.name);
                            return { ...task };
                        }
                        return task;
                    })
                }));*//*
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };*/

 /*   const handleDataUpdated = (entityType, action, item, id) => {
        console.log(`Data updated: ${entityType}, ${action}, ${item}, ${id}`);
        console.log(`It is now duration: ${item.duration}, start date: ${item.start_date} `)
        updateTask(item)
    };*/

    return (
        <div>
            <br />
            <p className='flex justify-center text-3xl text-white'>TIMELINE VIEW</p>
            <br />
            <Timeline taskClick={props.taskClick} />
        </div>
    );
};

export default TimelineView;
