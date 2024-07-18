
import React, { useState } from 'react';
import TableView from './TableView';
import KanbanView from './KanbanView';
import TimelineView from './TimelineView';
import { Sidebar } from './Sidebar/Sidebar';
import { Task, Roadmap, TaskStatus, Milestone, Tag, Assignee, UnitDataTypeWithNull, findIdForUnitType, UnitType, FilterStates, UnitDataType, ViewData } from './Interfaces';
import { FilterArea } from './FilterArea/FilterArea';
import { NavBar } from './NavBar/NavBar';
import { FilterButton } from './FilterButton';
import { ListView } from './ListView';
import { OrganizationView } from './OrganizationView';
import { AddPopup } from './AddPopup';

function App() {
    const [view, setView] = React.useState<string>('List'); 
    const [selectedItem, setSelectedItem] = React.useState<Task | Milestone | Tag | Assignee | null>(null); 
    const [showPopup, setShowPopup] = React.useState(false);

    React.useEffect(() => {
        fetchTasks();
        fetchMilestones();
        fetchTags();
        fetchAssignees();
        fetchUnitTypes();
        fetchRoadmaps();
        fetchTaskStatus();
    }, []);

    // #region Fetch Units
    const [tasks, setTasks] = useState<Task[]>([]); // State to hold tasks
    const [milestones, setMilestones] = useState<Milestone[]>([]); // State to hold milestones
    const [tags, setTags] = useState<Tag[]>([]); // State to hold milestones
    const [assignees, setAssignees] = useState<Assignee[]>([]); // State to hold milestones
    const [unitTypes, setUnitTypes] = React.useState<UnitType[]>([]);
    const [roadmaps, setRoadmaps] = React.useState<Roadmap[]>([]);
    const [taskStatuses, setTaskStatuses] = React.useState<TaskStatus[]>([]);

   /* const [unitAPIData, setUnitAPIData] = React.useState<UnitAPIData>({
        taskData: [],
        milestoneData: [],
        tagData: [],
        assigneeData: [],
        unitTypesData: [],
        roadmapData: []
    });

    React.useEffect(() => {
        setUnitAPIData({
            taskData: tasks,
            milestoneData: milestones,
            tagData: tags,
            assigneeData: assignees,
            roadmapData: roadmaps,
            unitTypesData: unitTypes,
        });
    }, [assignees, milestones, roadmaps, tags, tasks, unitTypes]);*/

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
    };

    const fetchTaskStatus = () => {
        fetch("/api/taskstatus")
            .then((res) => res.json())
            .then((data) => setTaskStatuses(data))
            .catch((error) => console.error('Error fetching task statuses:', error));
    }
    // #endregion

    // #region Filter Area Necessities
    const [selectedRoadmap, setSelectedRoadmap] = useState<Roadmap | null>(null); //keep
    const [selectedTaskStatus, setSelectedTaskStatus] = useState<TaskStatus | null>(null); //keep
    const [roadmapFilterState, setRoadmapFilterState] = React.useState<string[]>([]);
    const [taskStatusFilterState, setTaskStatusFilterState] = React.useState<string[]>([]);
    const [filterStates, setFilterStates] = React.useState<FilterStates>({roadmapFilterState: roadmapFilterState, taskStatusFilterState: taskStatusFilterState})

    React.useEffect(() => {
        setFilterStates({
            roadmapFilterState: roadmapFilterState,
            taskStatusFilterState: taskStatusFilterState,
        });
    }, [roadmapFilterState, taskStatusFilterState]);

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
        setView(viewName);
        handleUnitClick(null);

    };

    const handleUnitClick = (item: UnitDataTypeWithNull) => {
        setSelectedItem(item);
    };
    // #endregion

    const [viewData, setViewData] = React.useState<ViewData>({
        taskData: tasks,
        unitClick: handleUnitClick,
        selectedItem: selectedItem,
        unitTypeData: unitTypes,
        filterStates: filterStates,
    });

    React.useEffect(() => {
        setViewData({
            taskData: tasks,
            unitClick: handleUnitClick,
            selectedItem: selectedItem,
            unitTypeData: unitTypes,
            filterStates: filterStates,
        });
    }, [filterStates, selectedItem, tasks, unitTypes]);

    const handleAddButtonClick = () => {
        setShowPopup(true);
    };


    // #region Unit Updates
    const updateItem = (updatedItem: UnitDataTypeWithNull) => {
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
        else if (updatedItem.type === findIdForUnitType('TaskStatus', unitTypes)) {
            updateTaskStatus(updatedItem as TaskStatus)
        }
    }


    const updateTask = (updatedTask: Task) => {
        // Update task in API
        console.log("sending backend: ", updatedTask);
        fetch(`/api/tasks/${updatedTask.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTask),
        })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data === undefined) {
                console.log("data returned from backend is null")
                console.log("ERROR:", data.error)
                return;
            }
            console.log('Updated task:', data);
            // Update local state with updated task
            const updatedTasks: Task[] = tasks.map(task => (task.id === updatedTask.id ? data : task));
           setSelectedItem(data)
            console.log("updated new task to ", updatedTasks.find(task => task.id === data.id));
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

    const updateAssignee = (updatedAssignee: Assignee) => {
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

    const updateTaskStatus = (updatedTaskStatus: TaskStatus) => {
        // Update task in API
        fetch(`/api/taskstatus/${updatedTaskStatus.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTaskStatus),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated item:', data);
                // Update local state with updated task
                const updatedTaskStatuses: TaskStatus[] = taskStatuses.map(status => (status.id === updatedTaskStatus.id ? data : status));

                setAssignees(updatedTaskStatuses);


            })
            .catch(error => {
                console.error('Error updating task status:', error);
            });
    };

    // #endregion

    // #region Unit Delete
    const deleteItem = (deletedItem: UnitDataTypeWithNull) => {
        if (deletedItem == null) {
            return;
        }

        if (deletedItem.type === findIdForUnitType('Task', unitTypes)) {
            deleteTask(deletedItem as Task)
        }
        else if (deletedItem.type === findIdForUnitType('Milestone', unitTypes)) {
            deleteMilestone(deletedItem as Milestone)
        }
        else if (deletedItem.type === findIdForUnitType('Tag', unitTypes)) {
            deleteTag(deletedItem as Tag)
        }
        else if (deletedItem.type === findIdForUnitType('Assignee', unitTypes)) {
            deleteAssignee(deletedItem as Assignee)
        }
        else if (deletedItem.type === findIdForUnitType('TaskStatus', unitTypes)) {
            deleteTaskStatus(deletedItem as TaskStatus)
        }
    }


    const deleteTask = (deletedTask: Task) => {
        // Delete task in API
        console.log("delettask")
        console.log("sending backend: ", deletedTask);
        fetch(`/api/tasks/${deletedTask.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
      
        })
            .then(res => res.json())
            .then(data => {
              

                const indexToDelete = tasks.findIndex(task => task.id === deletedTask.id);
                console.log("deleting task index " + indexToDelete)
                if (indexToDelete !== -1) {
                    // Create a new array without the deleted task
                    const updatedTasks = [...tasks.slice(0, indexToDelete), ...tasks.slice(indexToDelete + 1)];

                    setTasks(updatedTasks);
                }
                setSelectedItem(null)
             
            })
            .catch(error => {
                console.error('Error deleting task:', error);
            });
    };

    const deleteMilestone = (deletedMilestone: Milestone) => {
        // Delete milestone in API
        console.log("sending backend ", deletedMilestone)
        fetch(`/api/milestones/${deletedMilestone.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletedMilestone),
        })
            .then(res => res.json())
            .then(data => {
                const indexToDelete = milestones.findIndex(ms => ms.id === deletedMilestone.id);
                console.log("deleting task index " + indexToDelete)
                if (indexToDelete !== -1) {
                    // Create a new array without the deleted task
                    const updatedMilestones = [...milestones.slice(0, indexToDelete), ...milestones.slice(indexToDelete + 1)];

                    setMilestones(updatedMilestones);
                }
                setSelectedItem(null)
            })
            .catch(error => {
                console.error('Error deleting milestone:', error);
            });
    };

    const deleteTag = (deletedTag: Tag) => {
        // Delete task in API
        fetch(`/api/tags/${deletedTag.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletedTag),
        })
            .then(res => res.json())
            .then(data => {
                const indexToDelete = tags.findIndex(tag => tag.id === deletedTag.id);
                console.log("deleting task index " + indexToDelete)
                if (indexToDelete !== -1) {
                    const updatedTags = [...tags.slice(0, indexToDelete), ...tags.slice(indexToDelete + 1)];

                    setTags(updatedTags);
                }
                setSelectedItem(null)


            })
            .catch(error => {
                console.error('Error deleting tag:', error);
            });
    }

    const deleteAssignee = (deletedAssignee: Assignee) => {
        // Delete task in API
        fetch(`/api/assignees/${deletedAssignee.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletedAssignee),
        })
            .then(res => res.json())
            .then(data => {
                const indexToDelete = assignees.findIndex(as => as.id === deletedAssignee.id);
                console.log("deleting task index " + indexToDelete)
                if (indexToDelete !== -1) {
                    // Create a new array without the deleted task
                    const updatedAssignees = [...assignees.slice(0, indexToDelete), ...assignees.slice(indexToDelete + 1)];

                    setAssignees(updatedAssignees);
                }
                setSelectedItem(null)


            })
            .catch(error => {
                console.error('Error deleting assignee:', error);
            });
    };

    const deleteTaskStatus = (deletedTaskStatus: TaskStatus) => {
        // Delete task in API
        fetch(`/api/taskstatus/${deletedTaskStatus.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletedTaskStatus),
        })
            .then(res => res.json())
            .then(data => {
                console.log("deleted ts id", deletedTaskStatus.id)
                console.log("all ts ", taskStatuses)

                const indexToDelete = taskStatuses.findIndex(ts => ts.id === deletedTaskStatus.id);
                console.log("delete ts index", indexToDelete)

                if (indexToDelete !== -1) {
                    // Create a new array without the deleted task
                    const updatedTaskStatus = [...taskStatuses.slice(0, indexToDelete), ...taskStatuses.slice(indexToDelete + 1)];
                    console.log("delete ts", updatedTaskStatus)
                    setTaskStatuses(updatedTaskStatus);
                }
                setSelectedItem(null)

            })
            .catch(error => {
                console.error('Error deleting task status:', error);
            });
    };
    // #endregion

    // #region Unit Create
    const createItem = (formData: any, type: string) => {
        console.log("create item routing on " + type)
        if (formData == null) {
            return;
        }
        console.log("create item routing form data not null")

        if (type === 'Task') {
            createTask(formData)
        }
        else if (type === 'Milestone') {
            createMilestone(formData);
        }
        else if (type === 'Tag') {
            console.log("tag create item")

            createTag(formData);
        }
        else if (type === 'Assignee') {
            console.log("assignee create item")

            createAssignee(formData);
        }
        else if (type === 'Task Status') {

            console.log("task status create item")
            createTaskStatus(formData);
        }
        else if (type === 'Roadmap') {

            console.log("roadmap create item")
            createRoadmap(formData);
        }

    }


    const createTask = async (formData: any) => {
         try {
          const response = await fetch('/api/tasks', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
          });

          if (!response.ok) {
              // Check if response is not successful (HTTP status code outside of 200-299 range)
              throw new Error(`HTTP error! Status: ${response.status}`);
          }

          // Assuming the API returns JSON data
             const data = await response.json();
             
             const newTask = data as Task;
             console.log("new task", newTask)

        

             setShowPopup(false)

             setTasks(prevTasks => [...prevTasks, newTask]);



      } catch (error) {
          // Handle fetch errors and API errors here
          console.error('Error fetching data:', error);
      }
    };

    const createMilestone = async (formData: any) => {
        // Create milestone in API
        console.log("sending backend ", formData)
        try {
            const response = await fetch('/api/milestones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                // Check if response is not successful (HTTP status code outside of 200-299 range)
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the API returns JSON data
            const data = await response.json();

            // Handle the response data as needed
            console.log('API response:', data);

            setShowPopup(false)

            const newMs = data as Milestone;
            console.log("new task", newMs)

            setMilestones(prev => [...prev, newMs]);


        } catch (error) {
            // Handle fetch errors and API errors here
            console.error('Error fetching data:', error);
        }
    };

    const createTag = async (formData:any) => {
        // Create task in API
        console.log("create tag")
        try {
            const response = await fetch('/api/tags', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}} & ${await response.json() }`);
            }

            // Assuming the API returns JSON data
            const data = await response.json();

            setShowPopup(false)

            const newTag = data as Tag;
            console.log("new tags", newTag)
            console.log("tag format", tags[0])

            setTags(prev => [...prev, newTag]);


        } catch (error) {
            // Handle fetch errors and API errors here
            console.error('Error fetching data:', error);
        }
    }

    const createAssignee = async (formData: any) => {
        // Create task in API
        try {
            const response = await fetch('/api/assignees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the API returns JSON data
            const data = await response.json();

            setShowPopup(false)

            const newAssignee = data as Assignee;
            console.log("new assignee", newAssignee)

            setAssignees(prev => [...prev, newAssignee]);


        } catch (error) {
            // Handle fetch errors and API errors here
            console.error('Error fetching data:', error);
        }
    };

    const createTaskStatus = async (formData: any) => {
        // Create task in API
        try {
            const response = await fetch('/api/taskstatus', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the API returns JSON data
            const data = await response.json();

            setShowPopup(false)

            const newTaskStatus = data as TaskStatus;
            console.log("new task status", newTaskStatus)

            setTaskStatuses(prev => [...prev, newTaskStatus]);


        } catch (error) {
            // Handle fetch errors and API errors here
            console.error('Error fetching data:', error);
        }
    };

    const createRoadmap = async (formData: any) => {
        // Create task in API
        try {
            const response = await fetch('/api/roadmaps', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Assuming the API returns JSON data
            const data = await response.json();

            setShowPopup(false)

            const newRoadmap = data as Roadmap;
            console.log("new roadmap", newRoadmap)

            setRoadmaps(prev => [...prev, newRoadmap]);


        } catch (error) {
            // Handle fetch errors and API errors here
            console.error('Error fetching data:', error);
        }
    };
    // #endregion

    return (
        <div className="flex h-screen w-full bg-alabaster gap-16">
            <NavBar handleNavItemClick={handleClick} view={view} />


            <div className='w-[300px] flex-1 h-full flex flex-col'>

                <div className=" h-[50px] shrink-0"></div>


                <div className='h-full flex flex-col'>
                    <div className='h-auto flex'>
                        <div className='flex-1 h-full flex-wrap'>
                            <FilterArea selectedRoadmap={selectedRoadmap} selectedTaskStatus={selectedTaskStatus}
                                handleFilterByTaskStatus={handleFilterByTaskStatus} handleFilterByRoadmap={handleFilterByRoadmap}
                                roadmapFilterState={roadmapFilterState} taskStatusFilterState={taskStatusFilterState} roadmapData={roadmaps} taskStatusData={taskStatuses } />

                        </div>



                        <div className='w-[100px] flex justify-end items-start'>
                            <FilterButton text="Add" onClick={handleAddButtonClick} />
                            {showPopup && <AddPopup setPopupVisibility={() => setShowPopup(false)} popupUnitType='' unitTypeData={unitTypes} roadmapData={roadmaps} assigneeData={assignees} tagData={tags} createItem={createItem} />}
                        </div>
                    </div>
                    <div className='flex-1 max-w-full overflow-x-auto relative'>

                        {/* if any view needs more data than view data, it can call its own API? */ }
                        {view === 'Timeline' && <TimelineView milestoneData={milestones} updateItem={updateItem} viewData={viewData} />}
                        {view === 'Table' && <TableView viewData={viewData} milestoneData={milestones} tagData={tags} assigneeData={assignees} />}
                        {view === 'Kanban' && <KanbanView viewData={viewData} milestoneData={milestones } />}
                        {view === 'List' && <ListView viewData={viewData} milestoneData={milestones} tagData={tags} assigneeData={assignees}/>}
                        {view === 'Organization' && <OrganizationView unitTypeData={unitTypes} tagData={tags} assigneeData={assignees} roadmapData={roadmaps} unitClick={handleUnitClick} selectedItem={selectedItem} taskStatusData={taskStatuses}  /> }
                       

                    </div>

                </div>


            </div>


            <div className='w-[300px] h-full flex flex-col'>
                <input
                    className="rounded-full px-4 py-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                    type="search"
                    placeholder="Search..."
                />

                <Sidebar sidebarData={selectedItem} updateItem={updateItem} assigneeData={assignees} roadmapData={roadmaps} unitTypeData={unitTypes} tagData={tags} deleteItem={deleteItem}  />


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