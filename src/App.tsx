import logo from './logo.svg';
import './App.css';

import React, { useState } from 'react';
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
import { Sidebar } from './Sidebar/Sidebar';
import { Task, Roadmap, TaskStatus, Milestone, Tag, Assignee } from './Interfaces';
import { FilterArea } from './FilterArea/FilterArea';

function App() {
    const [view, setView] = useState<string>('Table'); 
    const [selectedItem, setSelectedItem] = useState<Task | Milestone | Tag | Assignee | null>(null); 

    React.useEffect(() => {
        fetchTasks();
        fetchMilestones();
        fetchTags();
        fetchAssignees();
    }, []);

    // #region Fetch Units
    const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks
    const [milestones, setMilestones] = useState<Milestone[]>([]); // State to hold milestones
    const [tags, setTags] = useState<Tag[]>([]); // State to hold milestones
    const [assignees, setAssignees] = useState<Assignee[]>([]); // State to hold milestones


    const fetchTasks = () => {
        fetch("/api/tasks")
            .then((res) => res.json())
            .then((data) => setTasks(data.message))
            .catch((error) => console.error('Error fetching tasks:', error));
    };

    const fetchMilestones = () => {
        fetch("/api/milestones")
            .then((res) => res.json())
            .then((data) => setMilestones(data.message))
            .catch((error) => console.error('Error fetching milestones:', error));
    };

    const fetchTags = () => {
        fetch("/api/tags")
            .then((res) => res.json())
            .then((data) => setTags(data.message))
            .catch((error) => console.error('Error fetching tags:', error));
    };

    const fetchAssignees = () => {
        fetch("/api/assignees")
            .then((res) => res.json())
            .then((data) => setAssignees(data.message))
            .catch((error) => console.error('Error fetching assignees:', error));
    };
    // #endregion

    // #region Filter Area Necessities
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

    const handleTaskClick = (item: Task | Milestone | Tag | Assignee) => {
        console.log("Selected Task: ", item.name);
        setSelectedItem(item);
    };
    // #endregion

    // #region Unit Updates
    const updateTask = (updatedTask: Task) => {
        // Update task in API
        fetch(`/api/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        })
            .then(res => res.json())
            .then(data => {
                console.log(data.message)
                console.log('Updated task:', data.task);
                // Update local state with updated task
                const updatedTasks:Task[] = tasks.map(task => (task.id === updatedTask.id ? data.task : task));
                console.log("updated new task to " + updatedTasks[0].startDate)
                setTasks(updatedTasks);
                
               
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
    };

    const updateMilestone = (updatedMilestone: Milestone) => {
        // Update milestone in API
        fetch(`/api/milestones/${updatedMilestone.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMilestone),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated milestone:', data);
                // Update local state with updated milestone
                const updatedMilestones = milestones.map(milestone => (milestone.id === updatedMilestone.id ? data : milestone));
                setMilestones(updatedMilestones);
            })
            .catch(error => {
                console.error('Error updating milestone:', error);
            });
    };

    const updateTag = (updatedTag: Tag) => {
        // Update task in API
        fetch(`/api/tags/${updatedTag.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTag),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated item:', data);
                // Update local state with updated task
                const updatedTags: Tag[] = tags.map(tag => (tag.id === updatedTag.id ? data : tag));
 
                setTags(updatedTags);


            })
            .catch(error => {
                console.error('Error updating tag:', error);
            });
    };

    const updateAssignee = (updatedAssignee: Tag) => {
        // Update task in API
        fetch(`/api/assignees/${updatedAssignee.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedAssignee),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated item:', data);
                // Update local state with updated task
                const updatedTags: Assignee[] = assignees.map(assignee => (assignee.id === updatedAssignee.id ? data : assignee));
                
                setAssignees(updatedTags);


            })
            .catch(error => {
                console.error('Error updating assignee:', error);
            });
    };

    // #endregion

    return (
        <div>
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
            </header>

            <div className="flex flex-col bg-[#282c34] justify-center">
                <div className="font-bold text-white flex text-3xl justify-center">Project Management Tool</div>
                <div className='flex gap-4 justify-center'>
                    <button className={`bg-cyan-400 rounded border ${view === "Table" ? "bg-cyan-800" : "bg-cyan-400"} p-2`} onClick={() => handleClick("Table")}>Table</button>
                    <button className={`bg-cyan-400 rounded border ${view === "Kanban" ? "bg-cyan-800" : "bg-cyan-400"} p-2`} onClick={() => handleClick("Kanban")}>Kanban</button>
                    <button className={`bg-cyan-400 rounded border ${view === "Timeline" ? "bg-cyan-800" : "bg-cyan-400"} p-2`} onClick={() => handleClick("Timeline")}>Timeline</button>
                </div>
                <br />
                <FilterArea selectedRoadmap={selectedRoadmap} selectedTaskStatus={selectedTaskStatus} handleFilterByTaskStatus={handleFilterByTaskStatus} handleFilterByRoadmap={handleFilterByRoadmap} />

                <div className="flex justify-center">

                    <div>
                        {view === 'Timeline' && <TimelineView taskClick={handleTaskClick} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} taskData={tasks} milestoneData={milestones} />}
                        {view === 'Table' && <TableView rowClick={handleTaskClick} taskData={tasks} milestoneData={milestones} tagData={tags} assigneeData={assignees} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} selectedItem={selectedItem} />}
                        {view === 'Kanban' && <KanbanView rowClick={handleTaskClick} taskData={tasks} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} />}

                    </div>
                    <br />
                    <div>
                        <Sidebar sidebarData={selectedItem} updateTask={updateTask} updateMilestone={updateMilestone} updateTag={updateTag} updateAssignee={updateAssignee} />
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
                   