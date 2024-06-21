import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
import { Sidebar } from './Sidebar/Sidebar';
import { Task } from './Interfaces'

function App() {
    const [view, setView] = useState<string>(''); 
    const [selectedTask, setSelectedTask] = useState<Task|null>(null); 

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
                <h1 className="font-bold text-white">Project Management Tool</h1>
                <div className='flex gap-4 justify-center'>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Table")}>Table</button>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Kanban")}>Kanban</button>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Timeline")}>Timeline</button>
                </div>
            </header>

            <div className="flex flex-col bg-[#282c34] justify-between">
                <div className="flex justify-center">
                    <div>
                        {view === 'Timeline' && <TimelineView taskClick={handleTaskClick} />}
                        {view === 'Table' && <TableView />}
                        {view === 'Kanban' && <KanbanView />}
                    </div>
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
                   