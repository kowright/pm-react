import React, { Component } from 'react';

import { gantt } from 'dhtmlx-gantt';


import 'dhtmlx-gantt'; // Import Gantt library

const GanttChart = ({ tasks, onDataUpdated }) => {
    const ganttContainer = React.useRef(null);
    const [dataProcessor, setDataProcessor] = React.useState(null);

    React.useEffect(() => {
        if (!ganttContainer.current) return;

        // Initialize Gantt chart
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.init(ganttContainer.current);
        gantt.parse(tasks);

        gantt.attachEvent("onAfterTaskUpdate", (id, task) => {
            onDataUpdated('task', 'update', task, id);
        });

        // Initialize data processor
        const initGanttDataProcessor = () => {
            const processor = gantt.createDataProcessor((entityType, action, item, id) => {
                return new Promise((resolve, reject) => {
                    if (onDataUpdated) {
                        console.log("gantt data updated")
                        onDataUpdated(entityType, action, item, id);
                    }
                    return resolve();
                });
            });
            setDataProcessor(processor);
        };

        initGanttDataProcessor();

        return () => {
            gantt.clearAll();
            if (dataProcessor) {
                dataProcessor.destructor();
                setDataProcessor(null);
            }
        };
    }, [tasks, onDataUpdated]);

    const containerStyle = {
        width: '2000px',
        height: '600px', // Adjust this height as needed
    };

    return (
        <div ref={ganttContainer} style={containerStyle} className="w-full h-full overflow-x-auto"></div>
    );
};

export default GanttChart;