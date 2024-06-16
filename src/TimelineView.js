
import React from "react";
import { Gantt, Task, EventOption, StylingOption, ViewMode, DisplayOption } from 'gantt-task-react';
import "gantt-task-react/dist/index.css";
function TimelineView() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [])


    let tasks = [
        {
            start: new Date(2024, 5, 1),
            end: new Date(2024, 5, 2),
            name: 'Idea',
            id: 'Task 0',
            type: 'task',
            progress: 45,
            isDisabled: true,
            styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
        },
    ];


    if (data && data.message) {
        data.message.map((item, index) => (
            tasks.push(
                {
                    start: new Date(data.message[index].startDate),
                    end: new Date(data.message[index].endDate),
                    name: data.message[index].name,
                    id: 'Task 1',
                    type: 'task',
                    progress: 45,
                    isDisabled: true,
                    styles: { progressColor: '#ffbb54', progressSelectedColor: '#ff9e0d' },
                }
            )
        
        ))
    }

    return (
        <div>
            <h1>TIMELINE VIEW</h1>
            <div className="overflow-x-auto w-[2000px] p-4 border border-orange-600">
                <Gantt tasks={tasks} todayColor="#800080"/>
            </div>
        </div>
    );
};

export default TimelineView;