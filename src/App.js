import logo from './logo.svg';
import './App.css';

import React from "react";
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
function App() {
    const [view, setView] = React.useState('Table');

    const handleClick = (view) => {
        setView(view)
    };
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="font-bold text-white">Project Management Tool</h1>
                <div className='flex gap-4'>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Table")}>Table</button>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Kanban")}>Kanban</button>
                    <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleClick("Timeline")}>Timeline</button>
                </div>
                <br />
                {view === 'Timeline' && <TimelineView />}
                {view === 'Table' && <TableView />}
                {view === 'Kanban' && <KanbanView />}
            </header>
        </div>
    );
}


export default App;