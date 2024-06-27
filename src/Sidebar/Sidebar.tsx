import React from 'react';
import { Milestone, Task, Tag, Assignee, TaskStatus, Roadmap, formatDateNumericalMMDDYYYY, formatDateNumericalYYYYMMDDWithDashes } from '../Interfaces';

interface SidebarProps {
    sidebarData: Task | Milestone | Tag | Assignee | null; //what can show in the sidebar; ADD EVERYTHING ELSE
    updateTask: (updatedTask:Task) => void;
    updateMilestone: (updatedMilestone: Milestone) => void;
    updateTag: (updatedTag: Tag) => void;
    updateAssignee: (updatedAssignee: Assignee) => void;

}

export const Sidebar = ({
    sidebarData = null,
    ...props
}: SidebarProps) => {

    let hideContent: boolean = true;
    let sidebarContent: JSX.Element;

    sidebarContent = <div>NAHHHHHHHHHHHHHHHHH</div>

    //TASKS
    const [name, setName] = React.useState<string>(sidebarData?.name || '');
    const [description, setDescription] = React.useState(sidebarData?.description);
    const [task, setTask] = React.useState(sidebarData)
    const [assignees, setAssignees] = React.useState<{ message: Assignee[] } | null>(null);
    const [roadmaps, setRoadmaps] = React.useState<{ message: Roadmap[] } | null>(null);
    const [taskStatuses, setTaskStatuses] = React.useState<{ message: TaskStatus[] } | null>(null);

    React.useEffect(() => {
        // Fetch task statuses
        fetch("/api/taskstatus")
            .then((res) => res.json())
            .then((data) => setTaskStatuses(data))
            .catch((error) => console.error('Error fetching task statuses:', error));

        // Fetch assignees
        fetch("/api/assignees")
            .then((res) => res.json())
            .then((data) => setAssignees(data))
            .catch((error) => console.error('Error fetching assignees:', error));

        // Fetch roadmaps
        fetch("/api/roadmaps")
            .then((res) => res.json())
            .then((data) => setRoadmaps(data))
            .catch((error) => console.error('Error fetching roadmaps:', error));

        // Set initial values for name and description if sidebarData changes
        if (sidebarData) {
            setName(sidebarData.name || '');
            setDescription(sidebarData.description || '');
        }
    }, [sidebarData]); // Run whenever sidebarData changes


    if (sidebarData == null) {
        return <div>No details to display</div>
    }

    hideContent = false;

    // Function to handle name change
    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    // Function to handle description change
    const handleDescriptionChange = (event: any) => {
        setDescription(event.target.value);
    };

    const handleInputBlur = (event: any) => {
        //change it to call api and change backend 
        const editedValue = event.target.value;
        const propertyName = event.target.id; // Assuming id is the property name to update
        if (sidebarData.type === 'Task') {
            let updatedItem = { ...sidebarData as Task };

            if (propertyName === 'name') {
                updatedItem.name = event.target.value
            }
            if (propertyName === 'description') {
                updatedItem.description = event.target.value
            }
            //start date and end date for some reason gets set to the day before without this
            if (propertyName === 'startDate') {
                const originalDate = new Date(editedValue); // Parse editedValue into a Date object
                const nextDay = new Date(originalDate); // Create a new Date object based on originalDate
                nextDay.setDate(originalDate.getDate() + 1); // Set next day

                updatedItem.startDate = nextDay;
            }
            if (propertyName === 'endDate') {
                const originalDate = new Date(editedValue); // Parse editedValue into a Date object
                const nextDay = new Date(originalDate); // Create a new Date object based on originalDate
                nextDay.setDate(originalDate.getDate() + 1); // Set next day

                updatedItem.endDate = nextDay;
            }
            if (propertyName === 'assignee') {
                updatedItem.assignee.name = editedValue
            }
            if (propertyName === 'taskStatus') {
                updatedItem.taskStatus.name = editedValue
            }
            if (propertyName === 'roadmap') {
                const selectedOptions = Array.from(event.target.selectedOptions) as HTMLOptionElement[];
                const selectedRoadmapNames = selectedOptions.map(option => option.value);
                const selectedRoadmaps = roadmaps?.message.filter(roadmap => selectedRoadmapNames.includes(roadmap.name)) || [];

                console.log("roadmaps " ,selectedRoadmapNames)
                updatedItem.roadmaps = selectedRoadmaps;
                
            }

            props.updateTask(updatedItem as Task)
        }

        if (sidebarData.type === 'Milestone') {
            console.log("milestone blur")
            let updatedItem = { ...sidebarData as Milestone };

            if (propertyName === 'name') {
                updatedItem.name = event.target.value
            }
            if (propertyName === 'description') {
                updatedItem.description = event.target.value
            }
            //start date and end date for some reason gets set to the day before without this
            if (propertyName === 'date') {
                const originalDate = new Date(editedValue); // Parse editedValue into a Date object
                const nextDay = new Date(originalDate); // Create a new Date object based on originalDate
                nextDay.setDate(originalDate.getDate() + 1); // Set next day

                updatedItem.date = nextDay;
            }

            if (propertyName === 'taskStatus') {
                updatedItem.taskStatus.name = editedValue
            }


            props.updateMilestone(updatedItem as Milestone)
        }

        if (sidebarData.type === 'Tag') {
            console.log("tag blur")

            let updatedItem = { ...sidebarData as Tag };

            if (propertyName === 'name') {
                updatedItem.name = event.target.value
            }
            if (propertyName === 'description') {
                updatedItem.description = event.target.value
            }


            props.updateTag(updatedItem as Tag)
        }

        if (sidebarData.type === 'Assignee') {
            console.log("assignee blur")

            let updatedItem = { ...sidebarData as Assignee };

            if (propertyName === 'name') {
                updatedItem.name = event.target.value
            }
            if (propertyName === 'description') {
                updatedItem.description = event.target.value
            }

            props.updateAssignee(updatedItem as Assignee)
        }



    };

    switch (sidebarData.type) {
        case "Task":

            const taskData = sidebarData as Task;

            sidebarContent = (
                <div>
                    <div className='font-bold text-center'>TASK DETAILS</div>
                    <br/>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={name}
                        onChange={handleNameChange}
                        onBlur={handleInputBlur}
                     
                    />
                    <hr />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== taskData.description) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        } 
                    />
                    <hr />

                    <label htmlFor="roadmap">Roadmap:</label>
                    <select
                        multiple
                        id="roadmap"
                        defaultValue={taskData.roadmaps.map(roadmap => roadmap.name)}
                        onChange={(event) => { //can put on other things after API push check 
                            
                                console.log(event.target.value)
                                 handleInputBlur(event)

                            
                        }
                        }
                           >
                        {roadmaps?.message.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                      </select>
                    <hr/>

                    <label htmlFor="assignees">Assignee:</label>
                    <select
                        id="assignee"
                        value={taskData.assignee.name}
                        onChange={(event) => { //can put on other things after API push check 
                                if (event.target.value !== taskData.assignee.name) {
                                    console.log(event.target.value)
                                    handleInputBlur(event)
                                }
                            }
                        }
                    >
                        {assignees?.message.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name} 
                            </option>
                        ))}
                    </select>
                    <hr />

                    <label htmlFor="start date">Start Date: </label>
                     <input
                        id="startDate"
                        type="date"
                        defaultValue={formatDateNumericalYYYYMMDDWithDashes(new Date(taskData.startDate))} // Bind the selectedDate state to input value
                        //onChange={handleStartDateChange} // Handle date change
                        aria-label="Start Date"
                        onChange={(event) => { //can put on other things after API push check 
                            let startDateString = formatDateNumericalYYYYMMDDWithDashes(new Date(taskData.startDate));
                            if (event.target.value !== startDateString) {
                                //check if it's after end date
                                console.log(event.target.value + " != " + startDateString)
                                handleInputBlur(event)
                            }
                        }
                        } 
                    />
                    <hr />
                    <label htmlFor="end date">End Date: </label>
                    <input
                        id="endDate"
                        type="date"
                        defaultValue={formatDateNumericalYYYYMMDDWithDashes(new Date(taskData.endDate))} // Bind the selectedDate state to input value
                        onChange={(event) => { //can put on other things after API push check 
                            let endDateString = formatDateNumericalYYYYMMDDWithDashes(new Date(taskData.endDate));
                            if (event.target.value !== endDateString) {
                                //check if it's before start date
                                console.log(event.target.value + " != " + endDateString)
                                handleInputBlur(event)
                            }
                        }
                        } 
                        aria-label="End Date"
                    />
                    <hr />
                    <p>Duration: {taskData.duration} </p>


                    <hr />

                    <label htmlFor="task status">Task Status:</label>
                    <select
                        id="taskStatus"
                        value={taskData.taskStatus.name}
                        onChange={(event) => { //can put on other things after API push check 
                         
                            if (event.target.value !== taskData.taskStatus.name) {
                                handleInputBlur(event)
                            }
                        }
                        } 
                    >
                        {taskStatuses?.message.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>

                    <p>ID: {taskData.id} </p>
                    <hr/>
                </div>
            );
            break;
        case "Milestone":

            const milestoneData = sidebarData as Milestone; 
            sidebarContent = (
                <div>
                    <div className='font-bold text-center'>MILESTONE DETAILS</div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={name}
                        onChange={handleNameChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== milestoneData.name) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        }

                    />
                    <hr />

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== milestoneData.description) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        }
                    />
                    <hr />
                    <label htmlFor="date">Date: </label>
                    <input
                        id="date"
                        type="date"
                        defaultValue={formatDateNumericalYYYYMMDDWithDashes(new Date(milestoneData.date))} // Bind the selectedDate state to input value
                        //onChange={handleStartDateChange} // Handle date change
                        aria-label="date"
                        onChange={(event) => { //can put on other things after API push check 
                            let dateString = formatDateNumericalYYYYMMDDWithDashes(new Date(milestoneData.date));
                            if (event.target.value !== dateString) {
                                //check if it's after end date
                                handleInputBlur(event)
                            }
                        }
                        }
                    />
                    <hr />


                    <label htmlFor="task status">Task Status:</label>
                    <select
                        id="taskStatus"
                        value={milestoneData.taskStatus.name}
                        onChange={(event) => { //can put on other things after API push check 

                            if (event.target.value !== taskData.taskStatus.name) {
                                handleInputBlur(event)
                            }
                        }
                        }
                    >
                        {taskStatuses?.message.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>
                        <hr/>
                          <p>ID: {milestoneData.id} </p>
                        <hr />
                </div>
            );

            break;
        case "Tag":
            const tagData = sidebarData as Tag; 
            sidebarContent = (
                <div>
                    <div className='font-bold text-center'>TAG DETAILS</div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={name}
                        onChange={handleNameChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== tagData.name) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        }

                    />
                    <hr />
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== tagData.description) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        }
                        ></textarea>
                    <hr />
                    <p>ID: {tagData.id} </p>
                </div>
            );

            break;
        case "Assignee":
            const assigneeData = sidebarData as Assignee;
            sidebarContent = (
                <div>
                    <div className='font-bold text-center'>ASSIGNEE DETAILS</div>
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={name}
                        onChange={handleNameChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== assigneeData.name) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        }

                    />
                    <hr />
                    <textarea
                        id="description"
                        value={description}
                        onChange={handleDescriptionChange}
                        onBlur={(event) => { //can put on other things after API push check 
                            if (event.target.value !== assigneeData.description) {
                                console.log(event.target.value)
                                handleInputBlur(event)
                            }
                        }
                        }
                    ></textarea>
                    <hr />
                    <p>ID: {assigneeData.id} </p>
                </div>
            );

            break;
    }

    return (
        <div className='bg-white'>
            {!hideContent &&
                sidebarContent  
            }
        </div>
    );
};



//add more types to be shown in sidebar - probably should make a single type for it, put in interfaces and use everywhere
//make it so people can change anything in sidebar and type in it
//make it so it can be closed
//get rid of cell numbers
//make it so you can change the date range on page
//show which units cannot be changed - duration and id 
