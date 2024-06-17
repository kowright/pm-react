import React, { Component } from 'react';

import { gantt } from 'dhtmlx-gantt';


import 'dhtmlx-gantt'; // Import Gantt library

const GanttChart = ({ tasks }) => {
    const ganttContainer = React.useRef(null);

    React.useEffect(() => {
        if (!ganttContainer.current) return;

        // Initialize Gantt chart
        gantt.config.date_format = "%Y-%m-%d %H:%i";
        gantt.init(ganttContainer.current);
        gantt.parse(tasks);

        return () => {
            gantt.clearAll();
        };
    }, [tasks]);

    const containerStyle = {
        width: '2000px',
        height: '600px', // Adjust this height as needed
    };

    return (
        <div ref={ganttContainer} style={containerStyle} className="w-full h-full"></div>
    );
};

export default GanttChart;