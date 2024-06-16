import logo from './logo.svg';
import './App.css';

import React from "react";
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
function App() {
   
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h1 className="font-bold text-white">Project Management Tool</h1>
                <br />
                <KanbanView/>
            </header>
        </div>
    );
}


export default App;