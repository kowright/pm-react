import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
import { Sidebar } from './Sidebar/Sidebar';
import { Task, Roadmap, TaskStatus } from './Interfaces';
import { FilterArea } from './FilterArea/FilterArea';

function App() {
    const [view, setView] = useState<string>(''); 
    const [selectedTask, setSelectedTask] = useState<Task|null>(null); 

    //Filter Area Necessities
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null); //keep
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null); //keep
    const handleFilterByRoadmap = (roadmap: Roadmap | null) => { //keep
        setSelectedRoadmap(roadmap);
    };
    const handleFilterByTaskStatus = (status: TaskStatus | null) => { //keep
        console.log("task status is " + status)
        setSelectedTaskStatus(status);
    };

    const handleClick = (viewName: string) => {
        setView(viewName);
    };

    const handleTaskClick = (task: Task) => {
        console.log("Selected Task: ", task.name);
        setSelectedTask(task);
    };


    return (
        <div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <div className="flex flex-col bg-[#282c34] justify-ceenter">
                <div className="font-bold text-white flex text-3xl justify-center">Project Management Tool</div>
                <div className='flex gap-4 justify-center'>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Table")}>Table</button>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Kanban")}>Kanban</button>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Timeline")}>Timeline</button>
                </div>
                <br/>
                <FilterArea selectedRoadmap={selectedRoadmap} selectedTaskStatus={selectedTaskStatus} handleFilterByTaskStatus={handleFilterByTaskStatus} handleFilterByRoadmap={handleFilterByRoadmap} /> 

                <div className="flex justify-center">

                    <div>
                        {view === 'Timeline' && <TimelineView taskClick={handleTaskClick} />}
                        {view === 'Table' && <TableView roadmap={selectedRoadmap} taskStatus={ selectedTaskStatus} />}
                        {view === 'Kanban' && <KanbanView />}

                    </div>
                    <br />
                    <div>
                        <Sidebar sidebarData={selectedTask} />
                    </div>
                </div>

                <div>
                    <p className='text-white flex justify-center my-4'>Kortney Wright</p>
                </div>
            </div>
        </div>
    );
}

export default App;


//things to do
//put view/filter changing things in a component and do api call on parent to pass to children data and filters
//make roadmaps and tags be held in database and populate into header component 
//put sidebar component in here 
                   