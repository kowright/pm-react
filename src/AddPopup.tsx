import React from "react";
import {
    Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY, colorSets,
    UnitType, toCamelCase, formatDateNumericalYYYYMMDDWithDashes, Assignee, Tag
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
}

export const AddPopup = ({
    popupUnitType = '',
    ...props
}: AddPopupProps) => {
    const [unitTypeView, setUnitTypeView] = React.useState<string>(popupUnitType);

    let content: JSX.Element = <div>No forms to complete I am so sorry for this inconvinence, I will fire myself!.</div>

    // #region Fields
    const nameField = () => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>Name</div>
                <input
                    id="name"
                    type='text'
                    value={''}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
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
                    value=''
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                />
            </div>
        )
    };

    const roadmapField = () => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>Roadmap</div>
                <select
                    multiple
                    id="roadmap"
                    value=''
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
                >
                    {props.roadmapData?.map((option, index) => (
                        <option key={index} value={option.name}>
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
                    value=''
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

    const dateField = (dateID:string) => {
        return (
            <div className='text-smoky-black'>
                <div className='text-xs pb-1'>{dateID}</div>
                <input
                    id={toCamelCase(dateID)}
                    type="date"
                    value={formatDateNumericalYYYYMMDDWithDashes(new Date())}
                    className='border border-alabaster rounded-lg text-md pl-1 focus:ring-yinmn-blue focus:ring w-full'
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
                <p>TASK STUFF</p>
                {nameField()}
                {descriptionField()}
                {selectOptionsField('Tag', props.tagData)}
                {dateField('Start Date')}
                {dateField('End Date')}
                {/* TASK STATUS */}
                {selectOptionsField('Assignee', props.assigneeData)}
                {/* ROADMAPS  */}

            </div>
    }
    if (unitTypeView === 'Milestone') {
        content =
            <div>
                <p>Milestone STUFF</p>
                {nameField()}
            </div>
    }
    if (unitTypeView === 'Tag') {
        content =
            <div>
                <p>TAG STUFF</p>
                {nameField()}
            </div>
    }
    if (unitTypeView === 'Assignee') {
        content =
            <div>
                <p>ASSIGNEE STUFF</p>
                {nameField()}
            </div>
    }
    if (unitTypeView === 'Roadmap') {
        content =
            <div>
                <p>ROADMAP STUFF</p>
                {nameField()}
            </div>
    }
    if (unitTypeView === 'Task Status') {
        content =
            <div>
                <p>TASK STATUS STUFF</p>
                {nameField()}
            </div>
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-auto bg-gray-800 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg h-40 mx-auto flex flex-col justify-between">
                <div>
                    <h2 className="text-xl font-bold mb-4 flex">Add New</h2>
                    <div className='flex gap-4'>{unitButtons}</div>
                    {content}
                </div>
            

                <div className='flex justify-between'>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => props.setPopupVisibility()}>Close</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => props.setPopupVisibility()}>Save</button>
                </div>
            </div>
        </div>
    );
};


export default AddPopup;
