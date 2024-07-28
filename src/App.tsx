import React from 'react';
import { Assignee, Milestone, Tag, Task, Roadmap, UnitType, TaskStatus, FilterStates, UnitDataTypeWithNull, ViewData, UnitDataType } from './utils/models';
import { findIdForUnitType, imageUpload } from './utils/helpers';
import { NavBar } from './components/NavBar';
import { FilterArea } from './components/FilterArea';
import FilterButton from './components/FilterButton';
import TableView from './views/TableView';
import KanbanView from './views/KanbanView';
import ListView from './views/ListView';
import OrganizationView from './views/OrganizationView';
import { Sidebar } from './components/Sidebar';
import { ErrorPopup } from './components/ErrorPopup';
import { AddPopup } from './components/AddPopup';
import TimelineView from './views/TimelineView';

function App() {
    const [view, setView] = React.useState<string>('List');
    const [selectedItem, setSelectedItem] = React.useState<Task | Milestone | Tag | Assignee | null>(null);
    const [showPopup, setShowPopup] = React.useState(false);
    const [showErrorPopup, setShowErrorPopup] = React.useState(false);
    const [errorPopupContent, setErrorPopupContent] = React.useState(<div>WHAT</div>);
    const [listType, setListType] = React.useState('Task');

    // #region Unit Get

    React.useEffect(() => {
        fetchTasks();
        fetchMilestones();
        fetchTags();
        fetchAssignees();
        fetchUnitTypes();
        fetchRoadmaps();
        fetchTaskStatus();
    }, []);

    const [tasks, setTasks] = React.useState<Task[]>([]); // State to hold tasks
    const [milestones, setMilestones] = React.useState<Milestone[]>([]); // State to hold milestones
    const [tags, setTags] = React.useState<Tag[]>([]); // State to hold milestones
    const [assignees, setAssignees] = React.useState<Assignee[]>([]); // State to hold milestones
    const [unitTypes, setUnitTypes] = React.useState<UnitType[]>([]);
    const [roadmaps, setRoadmaps] = React.useState<Roadmap[]>([]);
    const [taskStatuses, setTaskStatuses] = React.useState<TaskStatus[]>([]);

    const fetchTasks = () => {
        fetch("/api/tasks?roadmaps=true&tags=true")
            .then((res) => res.json())
            .then((data) => setTasks(data))
            .catch((error) => console.error('Error fetching tasks:', error));
    };

    const fetchMilestones = () => {
        fetch("/api/milestones?roadmaps=true&tags=true")
            .then((res) => res.json())
            .then((data) => setMilestones(data))
            .catch((error) => console.error('Error fetching milestones:', error));
    };

    const fetchRoadmaps = () => {
        fetch("/api/roadmaps")
            .then((res) => res.json())
            .then((data) => setRoadmaps(data))
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

    // #region Filter Area 

    const [roadmapFilterState, setRoadmapFilterState] = React.useState<string[]>([]);
    const [taskStatusFilterState, setTaskStatusFilterState] = React.useState<string[]>([]);
    const [tagFilterState, setTagFilterState] = React.useState<string[]>([]);
    const [assigneeFilterState, setAssigneeFilterState] = React.useState<string[]>([]);
    const [showFilterAreaAssignees, setFilterAreaAssignees] = React.useState<boolean>(true);

    const [filterStates, setFilterStates] = React.useState<FilterStates>({
        roadmapFilterState: roadmapFilterState, taskStatusFilterState: taskStatusFilterState,
        tagFilterState: tagFilterState, assigneeFilterState: assigneeFilterState
    })

    React.useEffect(() => { //reset filter area on view switch
        setRoadmapFilterState([]);
        setTaskStatusFilterState([]);
        setTagFilterState([]);
        setAssigneeFilterState([]);
    
    }, [view])

    React.useEffect(() => {
        setFilterStates({
            roadmapFilterState: roadmapFilterState,
            taskStatusFilterState: taskStatusFilterState,
            tagFilterState: tagFilterState,
            assigneeFilterState: assigneeFilterState
       
        });
    }, [roadmapFilterState, taskStatusFilterState, tagFilterState, assigneeFilterState]);


    const handleFilterByRoadmap = (roadmap: Roadmap) => {
        setRoadmapFilterState(prevState => {
            const isAlreadyFiltered = prevState.includes(roadmap.name);

            if (isAlreadyFiltered) {
                return prevState.filter(map => map !== roadmap.name);
            } else {
                return [...prevState, roadmap.name];
            }
        });
    };


    const handleFilterByTaskStatus = (status: TaskStatus) => {
        setTaskStatusFilterState(prevState => {
            const isAlreadyFiltered = prevState.includes(status.name);

            if (isAlreadyFiltered) {
                return prevState.filter(stat => stat !== status.name);
            } else {
                return [...prevState, status.name];
            }
        });
    };

    const handleFilterByTag = (tag: Tag) => {
        setTagFilterState(prevState => {
            const isAlreadyFiltered = prevState.includes(tag.name);

            if (isAlreadyFiltered) {
                return prevState.filter(t => t !== tag.name);
            } else {
                return [...prevState, tag.name];
            }
        });
    };

    const handleFilterByAssignee = (assignee: Assignee) => {
        setAssigneeFilterState(prevState => {
            const isAlreadyFiltered = prevState.includes(assignee.name);

            if (isAlreadyFiltered) {
                return prevState.filter(a => a !== assignee.name);
            } else {
                return [...prevState, assignee.name];
            }
        });
    };

    const handleFilterAreaAssignees = (showAssignees: boolean) => {
        setFilterAreaAssignees(showAssignees)
    }
    // #endregion

    // #region Views
    const handleUnitClick = (item: UnitDataTypeWithNull) => {
        setSelectedItem(item);
    };

    const [viewData, setViewData] = React.useState<ViewData>({
        taskData: tasks,
        unitClick: handleUnitClick,
        selectedItem: selectedItem,
        unitTypeData: unitTypes,
        filterStates: filterStates,
        setShowFilterAreaAssignees: handleFilterAreaAssignees
    });

    React.useEffect(() => {
        setViewData({
            taskData: tasks,
            unitClick: handleUnitClick,
            selectedItem: selectedItem,
            unitTypeData: unitTypes,
            filterStates: filterStates,
            setShowFilterAreaAssignees: handleFilterAreaAssignees
        });
    }, [filterStates, selectedItem, tasks, unitTypes, tags, roadmaps, showFilterAreaAssignees]);

    const handleViewClick = (viewName: string) => {
        setView(viewName);
        handleUnitClick(null);
    };

    // #endregion

    // #region Unit Update
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
        else if (updatedItem.type === findIdForUnitType('Roadmap', unitTypes)) {
            updateRoadmap(updatedItem as Roadmap)
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

    const updateRoadmap = (updatedRoadmap: Roadmap) => {
        // Update task in API
        fetch(`/api/roadmaps/${updatedRoadmap.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedRoadmap),
        })
            .then(res => res.json())
            .then(data => {
                console.log('Updated roadmap:', data);

                const updatedRoadmaps: Roadmap[] = roadmaps.map(map => (map.id === updatedRoadmap.id ? data : map));
                console.log('updated raodmaps array', updatedRoadmaps)
                setRoadmaps(updatedRoadmaps);


            })
            .catch(error => {
                console.error('Error updating roadmap:', error);
            });
    };

    const updateAssignee = (updatedAssignee: Assignee) => {
        // Update task in API
        console.log("update assignee", updatedAssignee)
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

                setTaskStatuses(updatedTaskStatuses);


            })
            .catch(error => {
                console.error('Error updating task status:', error);
            });
    };

    // #endregion

    // #region Unit Delete

    const handleShowErrorPopup = (content: JSX.Element) => {
        setErrorPopupContent(content);
        setShowErrorPopup(true);
    };

    const handleGoBack = () => {
        setShowErrorPopup(false);
    };

    const handleGoFixIt = (listType: string, filterName: string, data: UnitDataType) => {

        setShowErrorPopup(false);
        setView('List');
        setListType(listType);
        setSelectedItem(null);

        if (data.type === findIdForUnitType('Tag', unitTypes)) {
            setTagFilterState([filterName]);
        }
        else if (data.type === findIdForUnitType('Assignee', unitTypes)) {
            //maybe none? 
        }
        else if (data.type === findIdForUnitType('Task Status', unitTypes)) {
            setTaskStatusFilterState([filterName]);
        }
        else if (data.type === findIdForUnitType('Roadmap', unitTypes)) {
            setRoadmapFilterState([filterName]);
        }
        else {
            console.log("handle go fix it cannot deal with this data.type")
        }

    };

    const deleteItem = (deletedItem: UnitDataTypeWithNull) => {
        if (deletedItem == null) {
            return;
        }

        handleShowErrorPopup(
            <div>
                <p>Are you sure that you want to delete <span className='text-red-600 font-bold'>{deletedItem.name}</span></p>

                <br />
                <br />
                <div className='flex justify-between'>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleDeleteItem(deletedItem)}>Yes, Delete It</button>
                </div>
            </div>
        );
    };

    const handleDeleteItem = (deletedItem: UnitDataTypeWithNull) => {
        if (deletedItem == null) {
            return;
        }

        setShowErrorPopup(false);

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
        else if (deletedItem.type === findIdForUnitType('Task Status', unitTypes)) {
            deleteTaskStatus(deletedItem as TaskStatus)
        }
        else if (deletedItem.type === findIdForUnitType('Roadmap', unitTypes)) {
            deleteRoadmap(deletedItem as Roadmap)
        }
        else {
            console.log("couldn't handle delete item what was selected")
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

    const deleteTag = (deletedTag: Tag, allowAutoDelete: boolean = false) => {
        // Delete task in API
        console.log("delete tag func")
        if (!allowAutoDelete) {
            console.log("no auto delete")
            const allTasksWithTag = tasks.filter(task =>
                task.tags.some(tag => tag.id === deletedTag.id)
            );
            if (allTasksWithTag.length > 0) {
                console.log("got some stuff to delete", allTasksWithTag);


                const changeToViewName = 'Task';

                handleShowErrorPopup(
                    <div>
                        <p><span className='text-red-600 font-bold'>[{deletedTag.name}] </span>is still being used by one or more tasks.</p>
                        <p>Please remove this status from all tasks before deleting (Go fix it).</p>
                        <p>Or allow an automatic removal of the tag from all tasks (Remove tag from everything).</p>
                        <p>These are the items that still have the status:</p>
                        <br />
                        <br />
                        {allTasksWithTag.map(i =>

                            <div>
                                <p>{i.name}</p>
                                <br />
                            </div>
                        )}

                        <div className='flex justify-between gap-4'>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoFixIt(changeToViewName, deletedTag.name, deletedTag)}>Go Fix It</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteTag(deletedTag, true) }}>Remove Tag From Everything</button>

                        </div>
                    </div>
                );
                return;
            }
            console.log("no tasks with tag " + deletedTag.name)
            const allMilestonesWithTag = milestones.filter(ms =>
                ms.tags.some(tag => tag.id === deletedTag.id)
            );
            if (allMilestonesWithTag.length > 0) {
                console.log("got some stuff to delete", allMilestonesWithTag);


                const changeToViewName = 'Milestone';

                handleShowErrorPopup(
                    <div>
                        <p><span className='text-red-600 font-bold'>[{deletedTag.name}] </span>is still being used by one or more milestones.</p>
                        <p>Please remove this status from all milestones before deleting (Go fix it).</p>
                        <p>Or allow an automatic removal of the tag from all milestones (Remove tag from everything).</p>
                        <p>These are the items that still have the status:</p>
                        <br />
                        <br />
                        {allMilestonesWithTag.map(i =>

                            <div>
                                <p>{i.name}</p>
                                <br />
                            </div>
                        )}

                        <div className='flex justify-between gap-4'>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoFixIt(changeToViewName, deletedTag.name, deletedTag)}>Go Fix It</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteTag(deletedTag, true) }}>Remove Tag From Everything</button>

                        </div>
                    </div>
                );
                return;
            }

        }
        else {
            deleteTag(deletedTag, true);
        }
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
                console.log("updating tags after deleting tag")
                setTags(updatedTags);
            }
            setSelectedItem(null)
            setTagFilterState(prev => {
                if (prev.includes(deletedTag.name)) {
                    return prev.filter(item => item !== deletedTag.name);
                } else {
                    return prev;
                }
            });

        })
        .catch(error => {
            console.error('Error deleting tag:', error);
        });
    }

    const deleteAssignee = (deletedAssignee: Assignee, allowAutoDelete: boolean = false) => {
        console.log("deleting assignee")
        if (!allowAutoDelete) {
            console.log("checking assignee references")

            const allTasksWithAssignee = tasks.filter(task =>
                task.assignee.id === deletedAssignee.id);

            if (allTasksWithAssignee.length > 0) {
                console.log("got some stuff to delete", allTasksWithAssignee);


                handleShowErrorPopup(
                    <div>
                        <p><span className='text-red-600 font-bold'>[{deletedAssignee.name}] </span>is still being used by one or more tasks.</p>
                        <p>Allow an automatic removal of the assignee from all tasks (Remove from everything).</p>
                        <p>These are the items that still have the roadmap:</p>
                        <br />
                        <br />
                        {allTasksWithAssignee.map(i =>

                            <div>
                                <p>{i.name}</p>
                                <br />
                            </div>
                        )}

                        <div className='flex justify-between gap-4'>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteAssignee(deletedAssignee, true) }}>Remove From Everything</button>

                        </div>
                    </div>
                );
            } else {
                console.log("check assignee ALL GOOD")
                deleteAssignee(deletedAssignee, true);
            }
            
            return;
        }

        console.log("delete delete assignee")


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

    const deleteTaskStatus = (deletedTaskStatus: TaskStatus, allowAutoDelete: boolean = false) => { 

        if (!allowAutoDelete) {

            const allMilestonesUsingStatus = milestones.filter(ms => ms.taskStatus.id === deletedTaskStatus.id);

            if (allMilestonesUsingStatus.length > 0) {
                console.log("got some milestones to delete", allMilestonesUsingStatus);


                const changeToViewName = 'Milestone';

                handleShowErrorPopup(
                    <div>
                        <p><span className='text-red-600 font-bold'>[{deletedTaskStatus.name}] </span>is still being used by one or more milestones.</p>
                        <p>Please remove this status from all milestones before deleting (Go fix it).</p>
                        <p>Or allow an automatic removal of the status from all milestones and they'll be set to Backlog (Remove tag from everything).</p>
                        <p>These are the items that still have the status:</p>
                        <br />
                        <br />
                        {allMilestonesUsingStatus.map(ms =>

                            <div>
                                <p>{ms.name}</p>
                                <br />
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoFixIt(changeToViewName, deletedTaskStatus.name, deletedTaskStatus)}>Go Fix It</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteTaskStatus(deletedTaskStatus, true) }}>Remove From Everything</button>

                        </div>
                    </div>
                );

            }

            const allTasksUsingStatus = tasks.filter(task => task.taskStatus.id === deletedTaskStatus.id);

            if (allTasksUsingStatus.length > 0) {
                console.log("got some stuff to delete", allTasksUsingStatus);
           

                const changeToViewName = 'Task';

                handleShowErrorPopup(
                    <div>
                        <p><span className='text-red-600 font-bold'>[{deletedTaskStatus.name}] </span>is still being used by one or more tasks.</p>
                        <p>Please remove this status from all tasks before deleting.</p>
                        <p>Or allow an automatic removal of the status from all tasks and they'll be set to Backlog (Remove tag from everything).</p>
                        <p>These are the items that still have the status:</p>
                        <br />
                        <br />
                        {allTasksUsingStatus.map(ms =>

                            <div>
                                <p>{ms.name}</p>
                                <br />
                            </div>
                        )}

                        <div className='flex justify-between'>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoFixIt(changeToViewName, deletedTaskStatus.name, deletedTaskStatus)}>Go Fix It</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteTaskStatus(deletedTaskStatus, true) }}>Remove From Everything</button>

                        </div>
                    </div>
                );
            }

            return;
        }
        else {
            deleteTaskStatus(deletedTaskStatus, true);
        }
        
        fetch(`/api/taskstatus/${deletedTaskStatus.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletedTaskStatus),
        })
        .then(res => res.json())
        .then(data => {
            console.log("data", data)
           

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
            setSelectedItem(null);
            setTaskStatusFilterState(prev => {
                if (prev.includes(deletedTaskStatus.name)) {
                    return prev.filter(item => item !== deletedTaskStatus.name);
                } else {
                    return prev;
                }
            });

        })
        .catch(error => {
            console.error('Error deleting task status:', error);
        });
    }

    const deleteRoadmap = (deletedRoadmap: Roadmap, allowAutoDelete: boolean = false) => {

        if (!allowAutoDelete) {

            const allTasksWithRoadmap = tasks.filter(task =>
                task.roadmaps.some(map => map.id === deletedRoadmap.id)
            );
            if (allTasksWithRoadmap.length > 0) {
                console.log("got some stuff to delete", allTasksWithRoadmap);
           

                const changeToViewName = 'Task';

                handleShowErrorPopup(
                    <div>
                        <p><span className='text-red-600 font-bold'>[{deletedRoadmap.name}] </span>is still being used by one or more tasks.</p>
                        <p>Please remove this roadmap from all tasks before deleting (Go fix it).</p>
                        <p>Or allow an automatic removal of the roadmap from all tasks (Remove tag from everything).</p>
                        <p>These are the items that still have the roadmap:</p>
                        <br />
                        <br />
                        {allTasksWithRoadmap.map(i =>

                            <div>
                                <p>{i.name}</p>
                                <br />
                            </div>
                        )}

                        <div className='flex justify-between gap-4'>
                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoFixIt(changeToViewName, deletedRoadmap.name, deletedRoadmap)}>Go Fix It</button>

                            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteRoadmap(deletedRoadmap, true) }}>Remove Tag From Everything</button>

                        </div>
                    </div>
                    );
            }

            const allMilestonesWithRoadmap = milestones.filter(ms =>
                ms.roadmaps.some(map => map.id === deletedRoadmap.id)
            );

            if (allMilestonesWithRoadmap.length > 0) {
                console.log("got some stuff to delete", allMilestonesWithRoadmap);
          

            const changeToViewName = 'Milestone';

            handleShowErrorPopup(
                <div>
                    <p><span className='text-red-600 font-bold'>[{deletedRoadmap.name}] </span>is still being used by one or more milestones.</p>
                    <p>Please remove this roadmap from all milestones before deleting (Go fix it).</p>
                    <p>Or allow an automatic removal of the roadmap from all milestones (Remove tag from everything).</p>
                    <p>These are the items that still have the status:</p>
                    <br />
                    <br />
                    {allMilestonesWithRoadmap.map(i =>

                        <div>
                            <p>{i.name}</p>
                            <br />
                        </div>
                    )}

                    <div className='flex justify-between gap-4'>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoBack()}>Go Back</button>

                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => handleGoFixIt(changeToViewName, deletedRoadmap.name, deletedRoadmap)}>Go Fix It</button>

                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => { setShowErrorPopup(false); deleteRoadmap(deletedRoadmap, true) }}>Remove Tag From Everything</button>

                    </div>
                </div>
                );
            }
            return;
        }
    


        fetch(`/api/roadmaps/${deletedRoadmap.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deletedRoadmap),
        })
        .then(res => res.json())
        .then(data => {
            console.log("deleted ts id", deletedRoadmap.id)

            const indexToDelete = roadmaps.findIndex(map => map.id === deletedRoadmap.id);

            if (indexToDelete !== -1) {
                const updatedRoadmaps = [...roadmaps.slice(0, indexToDelete), ...roadmaps.slice(indexToDelete + 1)];
                console.log("delete ts", deletedRoadmap)
                setRoadmaps(updatedRoadmaps);
            }
            setSelectedItem(null);
            setRoadmapFilterState(prev => {
                if (prev.includes(deletedRoadmap.name)) {
                    return prev.filter(item => item !== deletedRoadmap.name);
                } else {
                    return prev;
                }
            });

        })
        .catch(error => {
            console.error('Error deleting roadmap:', error);
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
      
        //assignee creation
        try {

            if (formData.fileInput !== null) {
                formData.imageId = await imageUpload(formData.fileInput);
            }
            console.log("form data assignee", formData)

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

    const handleAddButtonClick = () => {
        setShowPopup(true);
    };

    return (
        <div className="flex h-screen w-full bg-alabaster gap-16">
            {/* LEFT */}
            <NavBar handleNavItemClick={handleViewClick} view={view} />

            {/* MIDDLE */}
            <div className='w-[300px] flex-1 h-full flex flex-col'>
                <div className=" h-[50px] shrink-0"></div>

                <div className='h-full flex flex-col'>
                    <div className='h-auto flex'>
                        <div className='flex-1 h-full flex-wrap'>
                            {view !== "Organization" && <FilterArea
                                handleFilterByTaskStatus={handleFilterByTaskStatus} handleFilterByRoadmap={handleFilterByRoadmap} handleFilterByTag={handleFilterByTag} handleFilterByAssignee={handleFilterByAssignee}
                                filterStates={filterStates}
                                roadmapData={roadmaps} taskStatusData={taskStatuses} tagData={tags} unitTypeData={unitTypes} assigneeData={assignees}
                                showAssignees={showFilterAreaAssignees}
                            />
                              } 
                        </div>

                        <div className='w-[100px] flex justify-end items-start'>
                            <FilterButton text="Add" onClick={handleAddButtonClick} />
                            {showPopup && <AddPopup setPopupVisibility={() => setShowPopup(false)} popupUnitType='' unitTypeData={unitTypes} roadmapData={roadmaps} assigneeData={assignees} tagData={tags} createItem={createItem} />}
                        </div>
                    </div>
                    <div className='flex-1 max-w-full overflow-x-auto relative'>

                        {view === 'Timeline' && <TimelineView milestoneData={milestones} updateItem={updateItem} viewData={viewData} />}
                        {view === 'Table' && <TableView viewData={viewData} milestoneData={milestones} tagData={tags} assigneeData={assignees} />}
                        {view === 'Kanban' && <KanbanView viewData={viewData} milestoneData={milestones } />}
                        {view === 'List' && <ListView viewData={viewData} milestoneData={milestones} tagData={tags} assigneeData={assignees} listType={listType} />}
                        {view === 'Organization' && <OrganizationView unitTypeData={unitTypes} tagData={tags} assigneeData={assignees} roadmapData={roadmaps} unitClick={handleUnitClick} selectedItem={selectedItem} taskStatusData={taskStatuses}  /> }


                    </div>
                </div>
            </div>

            {/* RIGHT */}
            <div className='w-[300px] h-full flex flex-col'>
                <input
                    className="rounded-full px-4 py-2 my-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 shrink-0"
                    type="search"
                    placeholder="Search..."
                />

                <Sidebar sidebarData={selectedItem} updateItem={updateItem} assigneeData={assignees} roadmapData={roadmaps} unitTypeData={unitTypes} tagData={tags} taskStatusData={taskStatuses} deleteItem={deleteItem} setSelectedItem={setSelectedItem}  />
            </div>

            {/* FLOATING */}
            <div className='flex justify-center items-center'>
                {showErrorPopup && <ErrorPopup setPopupVisibility={() => setShowErrorPopup(false)} content={errorPopupContent} />}
            </div>

        </div>
    );
}

export default App;
