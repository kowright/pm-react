
import React from "react";
//import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
//import "gantt-task-react/dist/index.css";
import Gantt from './Gantt';
import './index.css'; // Import your global styles
import 'dhtmlx-gantt'; // Import Gantt library


function TimelineView() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [])
  
    let ganttData = {
        data: [

        ],
        links: [
            { id: 1, source: 1, target: 2, type: '0' }
        ]
    };
    if (data && data.message) {
        data.message.map((item, index) => (
            ganttData.data.push(
                {
                    
                    id: index+2,
                    text: data.message[index].name,
                    start_date: new Date(data.message[index].startDate),
                    duration: data.message[index].duration,
                    progress: 0.45,
                    
                }
            )
        
        ))
    }

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
          /*      setData(prev => ({
                    ...prev,
                    message: prev.message.map(task => {
                        if (task.id === (item.id - 1)) {
                            console.log("Found updated item; changing " + data.task.name);
                            return { ...task };
                        }
                        return task;
                    })
                }));*/
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };

    const handleDataUpdated = (entityType, action, item, id) => {
        console.log(`Data updated: ${entityType}, ${action}, ${item}, ${id}`);
        console.log(`It is now duration: ${item.duration}, start date: ${item.start_date} `)
        updateTask(item)
    };

    return (
        <div>
            <h1>TIMELINE VIEW</h1>
            
            <br />

            <div className="h-full w-full">
                <Gantt tasks={ganttData} onDataUpdated={handleDataUpdated} />
            </div>
        </div>
    );
};

export default TimelineView;

/*<div className="overflow-x-auto w-[2000px] p-4 border border-orange-600">
    <Gantt tasks={tasks} todayColor="#800080" />
</div>*/