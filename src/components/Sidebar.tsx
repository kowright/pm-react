import React from 'react';
import { Assignee, Milestone, Roadmap, Tag, Task, TaskStatus, Unit, UnitDataTypeWithNull, UnitType } from "../utils/models";
import { findIdForUnitType, formatDateNumericalYYYYMMDDWithDashes, toCamelCase } from "../utils/helpers";
import { colorSets } from '../utils/colors';
import AssigneeProfileImage from './AssigneeProfile';

interface SidebarProps {
    sidebarData: UnitDataTypeWithNull; 
    assigneeData: Assignee[];
    roadmapData: Roadmap[];
    unitTypeData: UnitType[];
    tagData: Tag[];
    taskStatusData: TaskStatus[];
    updateItem: (updatedItem: UnitDataTypeWithNull) => void;
    deleteItem: (deletedItem: UnitDataTypeWithNull) => void;
    setSelectedItem: (unit: UnitDataTypeWithNull) => void;
}

export const Sidebar = ({
    sidebarData = null,
    ...props
}: SidebarProps) => {

    let hideContent: boolean = true;
    let sidebarContent: JSX.Element;

    sidebarContent = <div>nothing to show.</div>

    const [data, setData] = React.useState<UnitDataTypeWithNull>(sidebarData)

    const buttonColorSet = colorSets['blue']

    React.useEffect(() => {
        setData(sidebarData);
    }, [sidebarData]);

    const handleInputBlur = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        console.log("input blur")
        const editedValue = event.target.value;
        const propertyName = event.target.id; 
        if (!data) {
            return; 
        }

        let updatedItem: Task | Milestone | Tag | Assignee;

        switch (data?.type) {
            case findIdForUnitType('Task', props.unitTypeData):

                let taskStatusToAssign;
                if (propertyName === 'taskStatus') {
                    taskStatusToAssign = props.taskStatusData?.find(status => editedValue === status.name);
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
               
                break;
            case findIdForUnitType('Milestone', props.unitTypeData):

                let taskStatusToAssignM;
                if (propertyName === 'taskStatus') {
                    taskStatusToAssignM = props.taskStatusData?.find(status => editedValue === status.name);
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
                
                break;

            case findIdForUnitType('Assignee', props.unitTypeData):

                if (propertyName === 'fileInput') {
                    updatedItem = {
                        ...(sidebarData as Assignee),

                        'imageId': (data as Assignee).imageId
                    }; 
                    break;
                }
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
                break;

            case findIdForUnitType('Roadmap', props.unitTypeData):
                updatedItem = {
                    ...(sidebarData as Roadmap),
                    [propertyName]: editedValue
                };

                break;
            default:
                throw new Error(`Unhandled sidebarData type: ${(sidebarData as any).type}`);
        }

        props.updateItem(updatedItem);
    };

    if (sidebarData === null) {
        return <div>Select an item to see details</div>
    }
 

    hideContent = false;

    const handleInputChange = async (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { id, value } = event.target;

        if (id === 'assignee') {
            const assigneeName = value;
            const selectedAssignee = props.assigneeData?.find(assignee => assignee.name === assigneeName);

            if (selectedAssignee) {
                setData(prevData => ({
                    ...(prevData as Task | Milestone | Tag | Assignee),
                    assignee: selectedAssignee
                }));
            }
        }
        else if (id === 'taskStatus') {
            const statusName = value;
            const selectedStatus = props.taskStatusData?.find(s => s.name === statusName);

            if (selectedStatus) {
                setData(prevData => ({
                    ...(prevData as Task | Milestone | Tag | Assignee),
                    taskStatus: selectedStatus
                }));
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
            }
        }
        else if (id === 'fileInput') {
            const fileInput = event.target as HTMLInputElement;
            const file = fileInput.files?.[0];
            if (file) {
                const formData = new FormData();
                formData.append('image', file);
                try {

                    const response = await fetch("/api/upload", {
                        method: 'POST',
                        body: formData,
                    });

                    if (response.ok) {
                        const data = await response.json();
                        console.log("File upload response:", data);
                        setData(prevData => {
                            const updatedData = {
                                ...(prevData as Task | Milestone | Tag | Assignee),
                                imageId: data 
                            };

                            return updatedData;
                        });

                    } else {
                        console.error('File upload failed with status:', response.status);
                    }
                } catch (error) {
                    console.error('Error uploading file:', error);
                }
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

    //TODO capitalize title in div
    const multipleSelectOptionsField = (title: string, roadmapNames: string[], array: any[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{title}</div> 
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

    const selectOptionsField = (title: string, value: string, array: Unit[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{title}</div>
                <select
                    id={toCamelCase(title)}//TODO should be based off Title {toCamelCase(title)
                    value={value || ''}
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

    // #region Create Unit Forms
    switch (sidebarData.type) {
        case findIdForUnitType('Task', props.unitTypeData):
            const taskData = data as Task;
       
            sidebarContent = (
                <div className='flex flex-col gap-2'>

                    {nameField(data?.name)}
                    {descriptionField(data?.description)}
                    {multipleSelectOptionsField('roadmap', taskData?.roadmaps?.map(roadmap => roadmap.name), props.roadmapData) }
                    {multipleSelectOptionsField('tag', taskData?.tags?.map(tag => tag.name), props.tagData)}
                    {selectOptionsField('Assignee', taskData.assignee.name, props.assigneeData as Unit[])}
                    {dateField(new Date(taskData?.startDate), "Start Date")}
                    {dateField(new Date(taskData?.endDate), "End Date")}
                    {selectOptionsField('Task Status', taskData.taskStatus.name, props.taskStatusData as Unit[])}
                    {stringFieldDisplay('Duration', taskData?.duration === 1 ? taskData?.duration + " day" : taskData?.duration + " days") }
                    {stringFieldDisplay('ID', taskData?.id.toString() )}
                </div>
            );
            break;

        case findIdForUnitType('Milestone', props.unitTypeData):

            const milestoneData = data as Milestone;
            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data?.name)} 
                    {descriptionField(data?.description)}
                    {dateField(new Date(milestoneData.date), "Date")}
                    {multipleSelectOptionsField('roadmap', milestoneData?.roadmaps?.map(roadmap => roadmap.name), props.roadmapData)}
                    {multipleSelectOptionsField('tag', milestoneData?.tags?.map(tag => tag.name), props.tagData)}
                    {selectOptionsField("Task Status", milestoneData.taskStatus.name, props.taskStatusData as Unit[])}
                    {stringFieldDisplay('ID', data.id.toString()) }
                </div>
            );

            break;
        case findIdForUnitType('Tag', props.unitTypeData):

            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString()) }
                </div>
            );

            break;
        case findIdForUnitType('Assignee', props.unitTypeData):
            const assigneeData = data as Assignee;

            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString())}
                    <AssigneeProfileImage imageId={assigneeData.imageId} />
                    <label htmlFor="fileInput">Choose a file:</label>
                    <input
                        type="file"
                        id="fileInput"
                        name="fileInput"
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                    />
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

        case findIdForUnitType('Task Status', props.unitTypeData):

            sidebarContent = (
                <div className='flex flex-col gap-2'>
                    {nameField(data.name)}
                    {descriptionField(data.description)}
                    {stringFieldDisplay('ID', data.id.toString())}
                </div>
            );
            break;
        default:
            console.error("couldn't find a type to show details in sidebar!")
    }

    // #endregion

    return (
        <div className='bg-white rounded-xl'>
            {!hideContent &&
                <div className='p-4 flex flex-col gap-2 relative'>
                    <div className='font-bold text-xl'>{props.unitTypeData.find(type => type.id === sidebarData.type)?.name.toUpperCase()} DETAILS</div>
                    {sidebarContent}
                    <br />
                    <button className={`px-4 py-2 rounded ${buttonColorSet.default} ${buttonColorSet.hover}`} onClick={() => props.deleteItem(sidebarData)}>Delete</button>
                    <div className={`absolute top-4 right-4 w-6 flex rounded-full items-center justify-center ${buttonColorSet.default} ${buttonColorSet.hover}`} onClick={() => props.setSelectedItem(null) }>X</div>
                </div>
            }
        </div>
    );
};