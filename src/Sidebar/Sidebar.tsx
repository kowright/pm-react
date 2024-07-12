import React from 'react';
import {
    Milestone, Task, Tag, Assignee, TaskStatus, Roadmap, UnitType, Unit,
    findIdForUnitType, formatDateNumericalMMDDYYYY, formatDateNumericalYYYYMMDDWithDashes,
    UnitData, toCamelCase
} from '../Interfaces';

interface SidebarProps {
    sidebarData: UnitData; //what can show in the sidebar; ADD EVERYTHING ELSE
   /* updateTask: (updatedTask:Task) => void;
    updateMilestone: (updatedMilestone: Milestone) => void;
    updateTag: (updatedTag: Tag) => void;
    updateAssignee: (updatedAssignee: Assignee) => void;*/
    updateItem: (updatedItem: UnitData) => void;
}


export const Sidebar = ({
    sidebarData = null,
    ...props
}: SidebarProps) => {

    let hideContent: boolean = true;
    let sidebarContent: JSX.Element;

    sidebarContent = <div>nothing to show.</div>

    const [data, setData] = React.useState< Task | Milestone | Tag | Assignee | null>(sidebarData)

    //const [task, setTask] = React.useState(sidebarData)
    const [assignees, setAssignees] = React.useState<Assignee[] | null>(null);
    const [roadmaps, setRoadmaps] = React.useState<Roadmap[] | null>(null);
    const [taskStatuses, setTaskStatuses] = React.useState<TaskStatus[]>([]);
    const [unitTypes, setUnitTypes] = React.useState<UnitType[]>([]);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const [taskStatusData, assigneesData, roadmapsData, unitTypeData] = await Promise.all([
                    fetch("/api/taskstatus").then(res => res.json()),
                    fetch("/api/assignees").then(res => res.json()),
                    fetch("/api/roadmaps").then(res => res.json()),
                    fetch("/api/unittypes").then(res => res.json())
                ]);
                setTaskStatuses(taskStatusData);
                setAssignees(assigneesData);
                setRoadmaps(roadmapsData);
                setUnitTypes(unitTypeData)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    React.useEffect(() => {
        setData(sidebarData); // Update data state with the latest sidebarData
    }, [sidebarData]);


    const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const editedValue = event.target.value;
        const propertyName = event.target.id; // Assuming id is the property name to update
        console.log("property name handle input blur ", propertyName);
        if (!data) {
            return; 
        }

        let updatedItem: Task | Milestone | Tag | Assignee;

        switch (data?.type) {
            case findIdForUnitType('Task', unitTypes):

                console.log("handle input blur task ", sidebarData)

                let taskStatusToAssign;
                if (propertyName === 'taskStatus') {
                    taskStatusToAssign = taskStatuses?.find(status => editedValue === status.name);
                } else {
                    taskStatusToAssign = (sidebarData as Task).taskStatus
                }

                const selectElement = event.target as HTMLSelectElement;

                const selectedOptions = selectElement.selectedOptions;
                const selectedRoadmapNames = selectedOptions ? Array.from(selectedOptions).map(option => option.value) : [];

                let selectedRoadmaps;
                if (propertyName === 'roadmap') {
                    selectedRoadmaps = roadmaps?.filter(roadmap => selectedRoadmapNames.includes(roadmap.name));
                } else {
                    selectedRoadmaps = (sidebarData as Task).roadmaps
                }

                const selectedAssignee = propertyName === 'assignee' ? assignees?.find(assignee => assignee.name === editedValue) : (sidebarData as Task).assignee;

                updatedItem = {
                    ...(sidebarData as Task),
                    [propertyName]: propertyName === 'startDate' || propertyName === 'endDate'
                        ? new Date(editedValue) : editedValue,
                    taskStatus: taskStatusToAssign,
                    roadmaps: selectedRoadmaps, 
                    assignee: selectedAssignee 
                };
               
                console.log("updated item in sidebar",updatedItem)
                break;
            case findIdForUnitType('Milestone', unitTypes):
                updatedItem = {
                    ...(sidebarData as Milestone),
                    [propertyName]: propertyName === 'date' ? new Date(editedValue) : editedValue,
                    
                      
                };

              /*  if (propertyName === 'taskStatus') {
                    (updatedItem as Milestone).taskStatus.name = editedValue;
                }
                */
                console.log("edited ", (updatedItem as Milestone).taskStatus)
                break;
            case findIdForUnitType('Tag', unitTypes):
                updatedItem = {
                    ...(sidebarData as Tag),
                    [propertyName]: editedValue
                };
                break;
            case findIdForUnitType('Assignee', unitTypes):
                updatedItem = {
                    ...(sidebarData as Assignee),
                    [propertyName]: editedValue
                };
                break;
            default:
                throw new Error(`Unhandled sidebarData type: ${(sidebarData as any).type}`);
        }

        //setData(updatedItem);

        // Assuming updateItem handles updating the state based on the item type
        props.updateItem(updatedItem);

    };


    if (sidebarData === null) {
        return <div>Select an item to see details</div>
    }
    else {
        console.log("sidebar data is not null- continue")
    }

    hideContent = false;

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = event.target;

        // Special handling for assignee dropdown
        if (id === 'assignee') {
            const assigneeName = value;
            const selectedAssignee = assignees?.find(assignee => assignee.name === assigneeName);

            if (selectedAssignee) {
                setData(prevData => ({
                    ...(prevData as Task | Milestone | Tag | Assignee),
                    assignee: selectedAssignee
                }));
                console.log("handle input change assignee", data)
            }
        }
        else if (id === 'roadmap') {
            const selectElement = event.target as HTMLSelectElement;
            const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);

            const selectedRoadmapObjects = roadmaps?.filter(roadmap => selectedOptions.includes(roadmap.name));

            if (selectedRoadmapObjects) {
                setData(prevData => ({
                    ...(prevData as Task | Milestone | Tag | Assignee),
                    roadmaps: selectedRoadmapObjects
                }));
                console.log("handle input change roadmap", data);
            }
        
        } else {
            setData(prevData => ({
                ...(prevData as Task | Milestone | Tag | Assignee),
                [id]: value
            }));
        }
    };

    if (data === null) {
        return <div>Select an item to see details</div>
    }

    const nameField = (value: string) => {
        return (
        <div className='text-smoky-black'>
            <div className='text-xs pb-1'>Name</div>
            <input
                id="name"
                type='text'
                value={value || ''}
                onChange={handleInputChange}
                onBlur={handleInputBlur}
                className='border border-black rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
            />
            </div>
        )
    };

    const descriptionField = (value: string) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>Description</div>
                <textarea
                    id="description"
                    value={value}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border border-black rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
                />
            </div>
        )
    };

    const roadmapField = (roadmapNames: string[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>Roadmap</div>
                <select
                    multiple
                    id="roadmap"
                    value={roadmapNames}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border border-black rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
                >
                    {roadmaps?.map((option, index) => (
                        <option key={index} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>


            </div>

        )
    };

    const selectOptionsField = (title: string, array: Unit[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{title}</div>
                <select
                    id="taskStatus"
                    value={toCamelCase(title)}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border border-black rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                >
                    {array?.map((option, index) => (
                        <option key={index} value={option.name}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

        )
    };

    const dateField = (date: Date, dateTitle: string) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{dateTitle}</div>
                <input
                    id={toCamelCase(dateTitle)}
                    type="date"
                    value={formatDateNumericalYYYYMMDDWithDashes(date)}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border border-black rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                />

            </div>
        )
    };

    const stringFieldDisplay = (title: string,  value: string) => {
        return (
            <div>
                <div className='text-xs pb-1'>{title}</div>
                <p>{value}</p>
            </div>

        )
    }
    switch (sidebarData.type) {
        case findIdForUnitType('Task', unitTypes):
            const taskData = data as Task;
            

            sidebarContent = (
                <div className='p-4 flex flex-col gap-2'>
                    <div className='font-bold text-xl'>TASK DETAILS</div>
                  

                   {/* <div>Name</div>
                    <input
                        id="name"
                        type='text'
                        value={data?.name || ''}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
                    />*/}
                    {nameField(data?.name)}

              {/*      <div>Description</div>
                    <textarea
                        id="description"
                        value={data?.description || ''}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg w-full'

                    />*/}
                    {descriptionField(data?.description)}
                    

                {/*    <div>Roadmap</div>
                    <select
                        multiple
                        id="roadmap"
                        value={taskData?.roadmaps?.map(roadmap => roadmap.name)}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg w-full'
                    >
                        {roadmaps?.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>*/}

                    {roadmapField(taskData?.roadmaps?.map(roadmap => roadmap.name)) }
                    
                    
                {/*    <div>Assignee</div>
                    <select
                        id="assignee"
                        value={taskData?.assignee?.name || ''}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg w-full'
                    >
                        {assignees?.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name} 
                            </option>
                        ))}
                    </select>*/}

                    {selectOptionsField('Assignee', assignees as Unit[])}

                   {/*
                                           <div>Start Date: </div>

                       <input
                        id="startDate"
                        type="date"
                        value={formatDateNumericalYYYYMMDDWithDashes(new Date(taskData?.startDate))}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg'

                    />*/}
                    
                    {dateField(new Date(taskData?.startDate), "Start Date")}

                 {/*   <div>End Date: </div>
                    <input
                        id="endDate"
                        type="date"
                        value={formatDateNumericalYYYYMMDDWithDashes(new Date(taskData?.endDate))}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg'
                    />*/}
                    {dateField(new Date(taskData?.endDate), "End Date")}
                    

                  {/*  <div>Task Status</div>
                   <select
                        id="taskStatus"
                        value={taskData?.taskStatus?.name}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg w-full'

                    >
                        {taskStatuses?.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>*/}
                    {selectOptionsField('Task Status', taskStatuses as Unit[])}

                    {/*<div className='text-xs pb-1'>Duration</div>
                    <p> {taskData?.duration === 1 ? taskData?.duration + " day" : taskData?.duration + " days"} </p>*/}
                    {stringFieldDisplay('Duration', taskData?.duration === 1 ? taskData?.duration + " day" : taskData?.duration + " days") }

                    {/*<div className='text-xs pb-1'>Duration</div>
                    <p>{data?.id} </p>
                    */}
                    {stringFieldDisplay('ID', data?.id.toString() )}


                </div>
            );
            break;

        case findIdForUnitType('Milestone', unitTypes):

            const milestoneData = data as Milestone;
            sidebarContent = (
                <div className='p-4'>
                    <div className='font-bold text-center'>MILESTONE DETAILS</div>
                    <br />
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={data?.name || ''}
                        onChange={handleInputChange}

                        onBlur={handleInputBlur}
                    />
                    

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={data?.description || ''}
                        onChange={handleInputChange}

                        onBlur={handleInputBlur}
                    />
                    

                    <label htmlFor="date">Date: </label>
                    <input
                        id="date"
                        type="date"
                        value={formatDateNumericalYYYYMMDDWithDashes(new Date(milestoneData?.date))}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    />
                    

                    <div>Task Status:</div>
                    <select
                        id="taskStatus"
                        value={milestoneData?.taskStatus.name}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        className='border border-black rounded-lg w-full'

                    >
                        {taskStatuses?.map((option, index) => (
                            <option key={index} value={option.name}>
                                {option.name}
                            </option>
                        ))}
                    </select>

                        <hr/>
                          <p>ID: {data?.id} </p>
                        
                </div>
            );

            break;
        case findIdForUnitType('Tag', unitTypes):
            //const tagData = sidebarData as Tag; 
            sidebarContent = (
                <div className='p-4'>
                    <div className='font-bold text-center'>TAG DETAILS</div>
                    <br />
                    <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={data?.name || ''}
                        onChange={handleInputChange}

                        onBlur={handleInputBlur}
                    />
                    

                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={data?.description || ''}
                        onChange={handleInputChange}

                        onBlur={handleInputBlur}
                    />
                    

                </div>
            );

            break;
        case findIdForUnitType('Assignee', unitTypes):
            //const assigneeData = sidebarData as Assignee;
           sidebarContent = (
               <div className='p-4'>
                   <div className='font-bold text-center'>TASK DETAILS</div>
                   <br />
                   <label htmlFor="name">Name:</label>
                   <input
                       id="name"
                       type='text'
                       value={data?.name || ''}
                       onChange={handleInputChange}

                       onBlur={handleInputBlur}
                   />
                   

                   <label htmlFor="description">Description:</label>
                   <textarea
                       id="description"
                       value={data?.description || ''}
                       onChange={handleInputChange}

                       onBlur={handleInputBlur}
                   />
                   

               </div>
            );

            break;
    }

    return (
        <div className='bg-white rounded-xl'>
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
