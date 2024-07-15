import React from "react";
import {
    Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY, colorSets, ViewData,
    UnitType, Tag, Assignee, UnitDataType, UnitDataTypeWithNull
} from './Interfaces';
import { FilterButton } from './FilterButton';

export interface OrganizationViewProps {
    unitTypeData: UnitType[];
    tagData: Tag[];
    assigneeData: Assignee[];
    roadmapData: Roadmap[];
    unitClick: (unit: UnitDataTypeWithNull) => void;
    selectedItem: UnitDataTypeWithNull;
}

export const OrganizationView = ({

    ...props
}: OrganizationViewProps) => {

    const [taskStatusData, setTaskStatusData] = React.useState<TaskStatus[]>([]);
    const [unitTypeView, setUnitTypeView] = React.useState<string>('');

    React.useEffect(() => {
        fetch("/api/taskstatus")
            .then((res) => res.json())
            .then((data) => {
                setTaskStatusData(data);
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []);

    function handleUnitClick(unitName: string) {
        setUnitTypeView(unitName);
        props.unitClick(null); //reset sidebar
    }

    const unitButtons = props.unitTypeData
        .filter(unit => unit.name !== 'Task' && unit.name !== 'Milestone')
        .map(unit => (
            <FilterButton key={unit.id} text={unit.name} onClick={() => handleUnitClick(unit.name)} active={unit.name === unitTypeView} />
        ));

    let content: JSX.Element = <div className='flex justify-center'>Click a Unit Type to see its settings.</div>;

    if (unitTypeView === 'Tag') {
        content =
            <div className='flex gap-4'>
                {props.tagData.map(tag => (
                    <FilterButton text={tag.name} onClick={() => props.unitClick(tag)} active={unitTypeView === 'Tag' && props.selectedItem?.id === tag.id} />
                ))}

            </div>
    }
    if (unitTypeView === 'Assignee') {
        content =
            <div className='flex gap-4'>
                {props.assigneeData.map(as => (
                    <FilterButton text={as.name} onClick={() => props.unitClick(as)} active={unitTypeView === 'Assignee' && props.selectedItem?.id === as.id} />
                ))}

            </div>
    }
    if (unitTypeView === 'Roadmap') {
        content =
            <div className='flex gap-4'>
                {props.roadmapData.map(map => (
                    <FilterButton text={map.name} onClick={() => props.unitClick(map)} active={unitTypeView === 'Roadmap' && props.selectedItem?.id === map.id } />
                ))}

            </div>
    }
    if (unitTypeView === 'Task Status') {
        content =
            <div className='flex gap-4'>
                {taskStatusData.map(status => (
                    <FilterButton text={status.name} onClick={() => props.unitClick(status)} active={unitTypeView === 'Task Status' && props.selectedItem?.id === status.id} />
                ))}

            </div>
    }

    return (
        <div className='flex flex-col'>
            <br/>
            <div className='flex gap-4'>
                {unitButtons}
            </div>
            <br />
            {content}

        </div>
    );
};
export default OrganizationView;
