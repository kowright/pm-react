import React from 'react';
import {
    Milestone, Task, Tag, Assignee, TaskStatus, Roadmap, UnitType, Unit,
    findIdForUnitType, formatDateNumericalMMDDYYYY, formatDateNumericalYYYYMMDDWithDashes,
    UnitDataTypeWithNull, toCamelCase
} from '../Interfaces';

interface SidebarProps {
    sidebarData: UnitDataTypeWithNull; 
    assigneeData: Assignee[];
    roadmapData: Roadmap[];
    unitTypeData: UnitType[];
    tagData: Tag[];
    updateItem: (updatedItem: UnitDataTypeWithNull) => void;
}

export const Sidebar = ({
    sidebarData = null,
    ...props
}: SidebarProps) => {

    let hideContent: boolean = true;
    let sidebarContent: JSX.Element;

    sidebarContent = <div>nothing to show.</div>

    const [data, setData] = React.useState<UnitDataTypeWithNull>(sidebarData)

    const [taskStatuses, setTaskStatuses] = React.useState<TaskStatus[]>([]);


    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const taskStatusData = await fetch("/api/taskstatus").then(res => res.json());
                setTaskStatuses(taskStatusData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);


    React.useEffect(() => {
        setData(sidebarData);
    }, [sidebarData]);


    const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

        const editedValue = event.target.value;
        const propertyName = event.target.id; 
        console.log("property name handle input blur ", propertyName);
        if (!data) {
            return; 
        }

        let updatedItem: Task | Milestone | Tag | Assignee;

        switch (data?.type) {
            case findIdForUnitType('Task', props.unitTypeData):

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
                    selectedRoadmaps = props.roadmapData?.filter(roadmap => selectedRoadmapNames.includes(roadmap.name));
                } else {
                    selectedRoadmaps = (sidebarData as Task).roadmaps
                }

                const selectedTagNames = selectedOptions ? Array.from(selectedOptions).map(option => option.value) : [];
                let selectedTags: any;
                if (propertyName === 'tag') {
                    selectedTags = props.tagData?.filter(tag => selectedTagNames.includes(tag.name));
                } else {
                    selectedTags = (sidebarData as Task).tags
                }

                const selectedAssignee = propertyName === 'assignee' ? props.assigneeData?.find(assignee => assignee.name === editedValue) : (sidebarData as Task).assignee;

                updatedItem = {
                    ...(sidebarData as Task),
                    [propertyName]: propertyName === 'startDate' || propertyName === 'endDate'
                        ? new Date(editedValue) : editedValue,
                    taskStatus: taskStatusToAssign,
                    roadmaps: selectedRoadmaps, 
                    assignee: selectedAssignee, 
                    tags: selectedTags
                };
               
                console.log("updated item in sidebar",updatedItem)
                break;
            case findIdForUnitType('Milestone', props.unitTypeData):

                let taskStatusToAssignM;
                if (propertyName === 'taskStatus') {
                    taskStatusToAssignM = taskStatuses?.find(status => editedValue === status.name);
                } else {
                    taskStatusToAssignM = (sidebarData as Task).taskStatus
                }

                const selectElementM = event.target as HTMLSelectElement;

                const selectedOptionsM = selectElementM.selectedOptions;

                const selectedRoadmapNamesM = selectedOptionsM ? Array.from(selectedOptionsM).map(option => option.value) : [];
                let selectedRoadmapsM;
                if (propertyName === 'roadmap') {
                    selectedRoadmapsM = props.roadmapData?.filter(roadmap => selectedRoadmapNamesM.includes(roadmap.name));
                } else {
                    selectedRoadmapsM = (sidebarData as Task).roadmaps
                }

                const selectedTagNamesM = selectedOptionsM ? Array.from(selectedOptionsM).map(option => option.value) : [];
                let selectedTagsM: any;
                if (propertyName === 'tag') {
                    selectedTagsM = props.tagData?.filter(tag => selectedTagNamesM.includes(tag.name));
                } else {
                    selectedTagsM = (sidebarData as Task).tags
                }

                const selectedAssigneeM = propertyName === 'assignee' ? props.assigneeData?.find(assignee => assignee.name === editedValue) : (sidebarData as Task).assignee;

                updatedItem = {
                    ...(sidebarData as Task),
                    [propertyName]: propertyName === 'startDate' || propertyName === 'endDate'
                        ? new Date(editedValue) : editedValue,
                    taskStatus: taskStatusToAssignM,
                    roadmaps: selectedRoadmapsM,
                    assignee: selectedAssigneeM,
                    tags: selectedTagsM
                };

                
                console.log("updated item in sidebar", updatedItem)
                break;

       

            case findIdForUnitType('Assignee', props.unitTypeData):
                updatedItem = {
                    ...(sidebarData as Assignee),
                    [propertyName]: editedValue
                };
                break;
            case findIdForUnitType('Tag', props.unitTypeData):
                updatedItem = {
                    ...(sidebarData as Tag),
                    [propertyName]: editedValue
                };
                break;
            case findIdForUnitType('TaskStatus', props.unitTypeData):
                updatedItem = {
                    ...(sidebarData as TaskStatus),
                    [propertyName]: editedValue
                };
                console.log("taskStatus update", updatedItem)
      
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
            const selectedAssignee = props.assigneeData?.find(assignee => assignee.name === assigneeName);

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

            const selectedRoadmapObjects = props.roadmapData?.filter(roadmap => selectedOptions.includes(roadmap.name));

            if (selectedRoadmapObjects) {
                setData(prevData => ({
                    ...(prevData as Task | Milestone | Tag | Assignee),
                    roadmaps: selectedRoadmapObjects
                }));
                console.log("handle input change roadmap", data);
            }
        
        }
        else if (id === 'tag') {
            const selectElement = event.target as HTMLSelectElement;
            const selectedOptions = Array.from(selectElement.selectedOptions).map(option => option.value);

            const selectedTagObjects = props.tagData?.filter(tag => selectedOptions.includes(tag.name));

            if (selectedTagObjects) {
                setData(prevData => ({
                    ...(prevData as Task | Milestone | Tag | Assignee),
                    tags: selectedTagObjects
                }));
                console.log("handle input change tag", data);
            }
        }

        else {
            setData(prevData => ({
                ...(prevData as Task | Milestone | Tag | Assignee),
                [id]: value
            }));
        }
    };

    if (data === null) {
        return <div>Select an item to see details</div>
    }

    // #region Form Fields

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
                className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
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
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
                />
            </div>
        )
    };

    const multipleSelectOptionsField = (title: string, roadmapNames: string[], array: any[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>Roadmap</div>
                <select
                    multiple
                    id={title}
                    value={roadmapNames}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full' 
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

    const selectOptionsField = (title: string, array: Unit[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{title}</div>
                <select
                    id="taskStatus"
                    value={toCamelCase(title)}
                    onChange={handleInputChange}
                    onBlur={handleInputBlur}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
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
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
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
    // #endregion
    switch (sidebarData.type) {
        case findIdForUnitType('Task', props.unitTypeData):
            const taskData = data as Task;
       

            sidebarContent = (
                <div className='flex flex-col gap-2'>
                  

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

                    {multipleSelectOptionsField('roadmap', taskData?.roadmaps?.map(roadmap => roadmap.name), props.roadmapData) }
                    
                    {multipleSelectOptionsField('tag', taskData?.tags?.map(tag => tag.name), props.tagData)}

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

                    {selectOptionsField('Assignee', props.assigneeData as Unit[])}

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
                    {stringFieldDisplay('ID', taskData?.id.toString() )}


                </div>
            );
            break;

        case findIdForUnitType('Milestone', props.unitTypeData):

            const milestoneData = data as Milestone;
            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)} 
               {/*     <label htmlFor="name">Name:</label>
                    <input
                        id="name"
                        type='text'
                        value={data?.name || ''}
                        onChange={handleInputChange}

                        onBlur={handleInputBlur}
                    />*/}
                    
                    {descriptionField(data.description)}
                  {/*  <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        value={data?.description || ''}
                        onChange={handleInputChange}

                        onBlur={handleInputBlur}
                    />
                    */}
                    {dateField(new Date(milestoneData.date), "Date")}
                    {multipleSelectOptionsField('roadmap', milestoneData?.roadmaps?.map(roadmap => roadmap.name), props.roadmapData)}

                    {multipleSelectOptionsField('tag', milestoneData?.tags?.map(tag => tag.name), props.tagData)}
                 {/*   <label htmlFor="date">Date: </label>
                    <input
                        id="date"
                        type="date"
                        value={formatDateNumericalYYYYMMDDWithDashes(new Date(milestoneData?.date))}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    />
                    */}
                    {selectOptionsField("Task Status", taskStatuses as Unit[])}

                   {/* <div>Task Status:</div>
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
                    </select>*/}
                    {stringFieldDisplay('ID', data.id.toString()) }
              {/*          <hr/>
                          <p>ID: {data?.id} </p>*/}
                        
                </div>
            );

            break;
        case findIdForUnitType('Tag', props.unitTypeData):
            //const tagData = sidebarData as Tag; 
            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString()) }
                </div>
            );

            break;
        case findIdForUnitType('Assignee', props.unitTypeData):
            //const assigneeData = sidebarData as Assignee;
            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString())}
                </div>
            );
            break;

        case findIdForUnitType('Roadmap', props.unitTypeData):
            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString())}
                </div>
            );

            break;

        case findIdForUnitType('TaskStatus', props.unitTypeData):
            //const assigneeData = sidebarData as Assignee;
            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString())}
                </div>
            );
    }

    return (
        <div className='bg-white rounded-xl'>
            {!hideContent &&
                <div className='p-4 flex flex-col gap-2'>
                    <div className='font-bold text-xl'>{props.unitTypeData.find(type => type.id === sidebarData.type)?.name.toUpperCase()} DETAILS</div>
                    {sidebarContent}
                </div>
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
