import React from "react";
import {
    Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY, colorSets,
    UnitType, toCamelCase, formatDateNumericalYYYYMMDDWithDashes, Assignee, Tag, UnitDataTypeWithNull
} from './Interfaces';
import { FilterButton } from './FilterButton';

export interface AddPopupProps {
    setPopupVisibility: () => void;
    //saveNewUnit: (Tag | Assignee | Roadmap | TaskStatus)=> void;
    popupUnitType: string;
    unitTypeData: UnitType[];
    roadmapData: Roadmap[];
    assigneeData: Assignee[];
    tagData: Tag[];
    createItem: (formData: any, type: string) => void;

}

export const AddPopup = ({
    popupUnitType = '',
    ...props
}: AddPopupProps) => {
    const [unitTypeView, setUnitTypeView] = React.useState<string>(popupUnitType);
    const [formData, setFormData] = React.useState({
        name: '', 
        description: '',
        tags: [], //array of num
        taskStatus: 1, //default Backlog
        startDate: '',
        endDate: '',
        roadmaps: [], //array of num
        assignee: 0 //default No Assignee
    });
    const [milestoneformData, setMilestoneFormData] = React.useState({
        name: '',
        description: '',
        tags: [], //array of num
        taskStatus: 1, //default Backlog
        date: '',
        roadmaps: [], //array of num
        assignee: 0 //default No Assignee
    });
    const [genericformData, setGenericFormData] = React.useState({
        name: '',
        description: '',
    });

    let content: JSX.Element = <div></div>

    const [taskStatusData, setTaskStatuses] = React.useState<TaskStatus[]>([]);

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
        if (new Date(formData.startDate) > new Date(formData.endDate)) {
            console.log("BAD DATES")
            alert("Start Date: " + formData.startDate + " must be on or before End Date: " + formData.endDate);
            return;
        }
    }, [formData])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission

        console.log("Form submitted", formData);

        if (unitTypeView === 'Task') {
           /* try {
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

                // Handle the response data as needed
                console.log('API response:', data);

                props.setPopupVisibility();
                window.location.reload();


            } catch (error) {
                // Handle fetch errors and API errors here
                console.error('Error fetching data:', error);
            }*/

            props.createItem(formData, unitTypeView)
        }
        else if (unitTypeView === 'Milestone') {
         /*   try {
                const response = await fetch('/api/milestones', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(milestoneformData),
                });

                if (!response.ok) {
                    // Check if response is not successful (HTTP status code outside of 200-299 range)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the API returns JSON data
                const data = await response.json();

                // Handle the response data as needed
                console.log('API response:', data);

                props.setPopupVisibility();
                 window.location.reload();


            } catch (error) {
                // Handle fetch errors and API errors here
                console.error('Error fetching data:', error);
            }*/
            props.createItem(milestoneformData, unitTypeView);
        } else {
         /*   let url = '/api/';
            if (unitTypeView === 'Tag') {

            }
            else if (unitTypeView === 'Assignee'){
                url += 'assignees'

            }
            else if (unitTypeView === 'Roadmap') {
                url += 'roadmaps'

            }
            else if (unitTypeView === 'Task Status') {
                url += 'taskstatus'

            }
            console.log("url", url)
            console.log(genericformData)
            try {
                const response = await fetch(url, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(genericformData),
                });

                if (!response.ok) {
                    // Check if response is not successful (HTTP status code outside of 200-299 range)
                    console.log("res", response)
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }

                // Assuming the API returns JSON data
                const data = await response.json();

                // Handle the response data as needed
                console.log('API response:', data);

                props.setPopupVisibility();
                 window.location.reload();


            } catch (error) {
                // Handle fetch errors and API errors here
                console.error('Error fetching data:', error);
            }*/
            console.log("add popup generic create item")
            props.createItem(genericformData, unitTypeView);

        }

        console.log("add popup handle submit end")
       
    };

    const handleChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value} = e.target;
        console.log('handle change target', e.target)
        console.log("handle change val", value)
        console.log("on " + unitTypeView);
        if (unitTypeView === 'Task') {
           
            if (name === 'taskStatus' || name === 'assignee') {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: parseInt(value, 10)
                }));
            }
            else if (name === 'roadmaps' || name === 'tags') {
                const { options } = e.target as HTMLSelectElement;

                const selectedValues = Array.from(options)
                    .filter(option => option.selected)
                    .map(option => parseInt(option.value, 10));


                setFormData(prevState => ({
                    ...prevState,
                    [name]: selectedValues
                }));
            }
            else {
                setFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }

        

        }
        else if (unitTypeView === 'Milestone') {

            if (name === 'taskStatus' || name === 'assignee') {
                setMilestoneFormData(prevState => ({
                    ...prevState,
                    [name]: parseInt(value, 10)
                }));
            }
            else if (name === 'roadmaps' || name === 'tags') {
                const { options } = e.target as HTMLSelectElement;

                const selectedValues = Array.from(options)
                    .filter(option => option.selected)
                    .map(option => parseInt(option.value, 10));

                setMilestoneFormData(prevState => ({
                    ...prevState,
                    [name]: selectedValues
                }));
            }
            else {
                setMilestoneFormData(prevState => ({
                    ...prevState,
                    [name]: value
                }));
            }
        }
        else {
            setGenericFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }

    };

    // #region Fields
    const nameField = () => {
        return (
            <div className='text-smoky-black'>
                <label htmlFor="name" className="block text-xs pb-1">
                    Name*
                </label>
                <input
                    id="name"
                    name='name'
                    type='text'
                    onChange={handleChange}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                    required
                />
            </div>
        )
    };

    const descriptionField = () => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>Description</div>
                <textarea
                    id="description"
                    name="description"
                    onChange={handleChange}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                />
            </div>
        )
    };

    const multipleSelectField = (title: string, array: any[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{title}</div>
                <select
                    multiple
                    id={toCamelCase(title)}
                    name={toCamelCase(title)}
                    onChange={handleChange}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                >
                    {array?.map((option, index) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

        )
    };

    const selectOptionsField = (dateID: string, array: any[]) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{dateID}</div>
                <select
                    id={toCamelCase(dateID)}
                    name={toCamelCase(dateID)}
                    onChange={handleChange}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                >
                    <option value=''></option> 
                    {array?.map((option, index) => (
                        <option key={option.id} value={option.id}>
                            {option.name}
                        </option>
                    ))}
                </select>
            </div>

        )
    };

    const dateField = (dateID:string) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{dateID}*</div>
                <input
                    id={toCamelCase(dateID)}
                    name={toCamelCase(dateID)}
                    type="date"
                    onChange={handleChange}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                    required
                />

            </div>
        )
    };

    // #endregion

    const unitButtons = props.unitTypeData
        .map(unit => (
            <FilterButton key={unit.id} text={unit.name} onClick={() => handleUnitClick(unit.name)} active={unit.name === unitTypeView} />
        ));
    function handleUnitClick(unitName: string) {
        setUnitTypeView(unitName);
    }

    if (unitTypeView === 'Task') {
        content =
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {nameField()}
                        {descriptionField()}
                        {dateField('Start Date')}
                        {dateField('End Date')}
                        {multipleSelectField('Tags', props.tagData)}
                        {selectOptionsField('Task Status', taskStatusData)}
                        {selectOptionsField('Assignee', props.assigneeData)}
                        {multipleSelectField('Roadmaps', props.roadmapData)}
                    </div>
                    <div className='flex justify-between'>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => props.setPopupVisibility()}>Close</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
    }
    else if (unitTypeView === 'Milestone') {
        content =
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        {nameField()}
                        {descriptionField()}
                        {dateField('Date')}
                        {multipleSelectField('Tags', props.tagData)}
                        {selectOptionsField('Task Status', taskStatusData)}
                        {selectOptionsField('Assignee', props.assigneeData)}
                        {multipleSelectField('Roadmaps', props.roadmapData)}
                    </div>
                    <div className='flex justify-between'>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => props.setPopupVisibility()}>Close</button>
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                    </div>
                </form>
            </div>
    }
    else if (unitTypeView !== '') { 
        content =
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    {nameField()}
                    {descriptionField()}
                </div>

                <div className='flex justify-between'>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => props.setPopupVisibility()}>Close</button>
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Save</button>
                </div>
                </form>
            </div>
    }


    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg h-40 mx-auto flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-4 flex">Add New</h2>
                    <div className='flex gap-4'>{unitButtons}</div>
                    <br/>
                    {content}
                </div>
            
                {unitTypeView === '' && <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => props.setPopupVisibility()}>Close</button>
}
              
            </div>
        </div>
    );
};


export default AddPopup;
