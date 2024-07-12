
import React, { useState } from 'react';
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
import { Sidebar } from './Sidebar/Sidebar';
import { Task, Roadmap, TaskStatus, Milestone, Tag, Assignee, UnitData, findIdForUnitType, UnitType } from './Interfaces';
import { FilterArea } from './FilterArea/FilterArea';
import { NavBar } from './NavBar/NavBar';
import { FilterButton } from './FilterButton';
import { ListView } from './ListView';
function App() {
    const [view, setView] = React.useState<string>('List'); 
    const [selectedItem, setSelectedItem] = useState<Task | Milestone | Tag | Assignee | null>(null); 

    React.useEffect(() => {
        fetchTasks();
        fetchMilestones();
        fetchTags();
        fetchAssignees();
        fetchUnitTypes();
        fetchRoadmaps();
    }, []);

    // #region Fetch Units
    const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks
    const [milestones, setMilestones] = useState<Milestone[]>([]); // State to hold milestones
    const [tags, setTags] = useState<Tag[]>([]); // State to hold milestones
    const [assignees, setAssignees] = useState<Assignee[]>([]); // State to hold milestones
    const [unitTypes, setUnitTypes] = React.useState<UnitType[]>([]);
    const [roadmaps, setRoadmaps] = React.useState<Roadmap[]>([]);


    const fetchTasks = () => {
        fetch("/api/tasks?roadmaps=true&tags=true")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error('Error fetching tasks:', error));
    };

    const fetchMilestones = () => {
        fetch("/api/milestones?roadmaps=true&tags=true")
            .then((res) => res.json())
            .then((data) => {
                console.log("data", data)
                setMilestones(data) })
            .catch((error) => console.error('Error fetching milestones:', error));
    };

    const fetchRoadmaps = () => {
        fetch("/api/roadmaps")
            .then((res) => res.json())
            .then((data) => {
                setRoadmaps(data);
                //console.log("roadmapss ", (data as Roadmap[])?.map(map => map.name))
            })
            .catch((error) => console.error('Error fetching data:', error));
    };

    const fetchTags = () => {
        fetch("/api/tags")
            .then((res) => res.json())
            .then((data) => setTags(data))
            .catch((error) => console.error('Error fetching tags:', error));
    };

    const fetchAssignees = () => {
        fetch("/api/assignees")
            .then((res) => res.json())
            .then((data) => setAssignees(data))
            .catch((error) => console.error('Error fetching assignees:', error));
    };

    const fetchUnitTypes = () => {
        fetch("/api/unittypes")
            .then((res) => res.json())
            .then((data) => setUnitTypes(data))
            .catch((error) => console.error('Error fetching unit types:', error));
    }
    // #endregion

    // #region Filter Area Necessities
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null); //keep
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null); //keep
    const [roadmapFilterState, setRoadmapFilterState] = React.useState<string[]>([]);
    const [taskStatusFilterState, setTaskStatusFilterState] = React.useState<string[]>([]);

    const handleFilterByRoadmap = (roadmap: Roadmap) => { //keep
        
        //setSelectedRoadmap(roadmap);
        if (roadmap === null) {
            return;
        }

        if (roadmapFilterState.includes(roadmap?.name)) {
            console.log("take out " + roadmap?.name)
            setRoadmapFilterState(prev => prev.filter(map => map !== roadmap?.name));
        }
        else {
            console.log("add " + roadmap?.name)
            setRoadmapFilterState(prev => [...prev, roadmap?.name]);
        }


    };

    const handleFilterByTaskStatus = (status: TaskStatus) => { //keep
        // setSelectedTaskStatus(status);
        console.log("clicked " + status.name)
        if (taskStatusFilterState.includes(status.name)) {
            console.log("take out " + status.name)

            setTaskStatusFilterState(prev => prev.filter(stat => stat !== status.name));
        }
        else {
            console.log("add " + status.name)

            setTaskStatusFilterState(prev => [...prev, status.name]);
        }


    };

    const handleClick = (viewName: string) => {
        console.log("clicked " + viewName)
        setView(viewName);
    };

    const handleTaskClick = (item: Task | Milestone | Tag | Assignee) => {
       // console.log("Selected Task: ", item.name);
        setSelectedItem(item);
    };
    // #endregion

    // #region Unit Updates
    const updateItem = (updatedItem: UnitData) => {
        if (updatedItem == null) {
            return;
        }

        if (updatedItem.type === findIdForUnitType('Task', unitTypes)) {
            updateTask(updatedItem as Task)
        }
        else if (updatedItem.type === findIdForUnitType('Milestone', unitTypes)) {
            updateMilestone(updatedItem as Milestone)
        }
        else if (updatedItem.type === findIdForUnitType('Tag', unitTypes)) {
            updateTag(updatedItem as Tag)
        }
        else if (updatedItem.type === findIdForUnitType('Assignee', unitTypes)) {
            updateAssignee(updatedItem as Assignee)
        }
    }


    const updateTask = (updatedTask: Task) => {
        // Update task in API
        console.log("sending backend: ", updatedTask)
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
            if (data.message === undefined) {
                console.log("data returned from backend is null")
                console.log("data error: ", data.error)
                return;
            }
            console.log('Updated task:', data.task);
            // Update local state with updated task
            const updatedTasks: Task[] = tasks.map(task => (task.id === updatedTask.id ? data.task : task));
           setSelectedItem(data.task)
            console.log("updated new task to ", updatedTasks.find(task => task.id === data.task.id));
            setTasks(updatedTasks);
        })
        .catch(error => {
            console.error('Error updating task:', error);
        });
    };

    const updateMilestone = (updatedMilestone: Milestone) => {
        // Update milestone in API
        console.log("sending backend ", updatedMilestone)
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
        <div className="flex h-full w-full bg-alabaster gap-16">
            <NavBar handleNavItemClick={handleClick} view={view} />


            <div className='w-[300px] flex-1 h-full flex flex-col'>

                <div className=" h-[50px] shrink-0"></div>


                <div className='h-full flex flex-col'>
                    <div className='h-auto flex'>
                        <div className='flex-1 h-full flex-wrap'>
                            <FilterArea selectedRoadmap={selectedRoadmap} selectedTaskStatus={selectedTaskStatus}
                                handleFilterByTaskStatus={handleFilterByTaskStatus} handleFilterByRoadmap={handleFilterByRoadmap}
                                roadmapFilterState={roadmapFilterState} taskStatusFilterState={taskStatusFilterState} />

                        </div>



                        <div className='w-[100px] flex justify-end items-start'>
                            <FilterButton text="Add" onClick={() => console.log("hi")} />
                        </div>
                    </div>
                    <div className='flex-1 max-w-full overflow-x-auto relative'>

                        
                        {view === 'Timeline' && <TimelineView taskClick={handleTaskClick} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} taskData={tasks} milestoneData={milestones} updateItem={updateItem} unitTypeData={unitTypes} taskStatusFilterState={taskStatusFilterState} roadmapFilterState={roadmapFilterState} />}
                        {view === 'Table' && <TableView rowClick={handleTaskClick} taskData={tasks} milestoneData={milestones} tagData={tags} assigneeData={assignees} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} selectedItem={selectedItem} unitTypeData={unitTypes} taskStatusFilterState={taskStatusFilterState} roadmapFilterState={roadmapFilterState} />}
                        {view === 'Kanban' && <KanbanView rowClick={handleTaskClick} taskData={tasks} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} selectedItem={selectedItem} taskStatusFilterState={taskStatusFilterState} roadmapFilterState={roadmapFilterState} />}
                        {view === 'List' && <ListView rowClick={handleTaskClick} taskData={tasks} milestoneData={milestones} tagData={tags} assigneeData={assignees} roadmap={selectedRoadmap} taskStatus={selectedTaskStatus} selectedItem={selectedItem} unitTypeData={unitTypes} roadmapFilterState={roadmapFilterState} taskStatusFilterState={taskStatusFilterState} />}
                        {view === 'Organization' && <div><br />Change settings! woooo</div> }
                       

                    </div>

                </div>


            </div>






            <div className='w-[300px] h-full flex flex-col bg-blue-300'>

                <div className="bg-yellow-300 h-[50px] p-2 shrink-0">
                    <div className='bg-yellow-800 rounded-full'>SEARCH</div>
                </div>

                <Sidebar sidebarData={selectedItem} updateItem={updateItem} />


            </div>
        </div>


    );
}

export default App;


//things to do
//put view/filter changing things in a component and do api call on parent to pass to children data and filters
//make roadmaps and tags be held in database and populate into header component
//put sidebar component in here
//could reduce amount of props params by putting it in a variable first
/* <div>
                        <Sidebar sidebarData={selectedItem} updateItem={updateItem} />
                    </div>

                <FilterArea selectedRoadmap={selectedRoadmap} selectedTaskStatus={selectedTaskStatus} handleFilterByTaskStatus={handleFilterByTaskStatus} handleFilterByRoadmap={handleFilterByRoadmap} />
*/