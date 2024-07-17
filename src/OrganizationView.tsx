import React from "react";
import {
    Milestone, Roadmap, Task, TaskStatus, formatDateNumericalMMDDYYYY, colorSets, ViewData,
    UnitType, Tag, Assignee, UnitDataType, UnitDataTypeWithNull, findUnitTypefromId
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
            <FilterButton key={unit.id} text={unit.name} onClick={() => handleUnitClick(unit.name)} active={unit.name === unitTypeView} colorByType={unit.name} />
        ));

    let content: JSX.Element = <div className='flex justify-center'>Click a Unit Type to see its settings.</div>;

    if (unitTypeView === 'Tag') {
        content =
            <div className='flex gap-4'>
                {props.tagData.map(tag => (
                    <FilterButton text={tag.name} onClick={() => props.unitClick(tag)} active={unitTypeView === 'Tag' && props.selectedItem?.id === tag.id} colorByType={findUnitTypefromId(tag.type, props.unitTypeData)} />
                ))}

            </div>
    }
    if (unitTypeView === 'Assignee') {
        content =
            <div className='flex gap-4 flex-wrap'>
                {props.assigneeData.map(as => (
                    <FilterButton text={as.name} onClick={() => props.unitClick(as)} active={unitTypeView === 'Assignee' && props.selectedItem?.id === as.id} colorByType={findUnitTypefromId(as.type, props.unitTypeData)} />
                ))}
            </div>
    }
    if (unitTypeView === 'Roadmap') {
        content =
            <div className='flex gap-4 flex-wrap'>
                {props.roadmapData.map(map => (
                    <FilterButton text={map.name} onClick={() => props.unitClick(map)} active={unitTypeView === 'Roadmap' && props.selectedItem?.id === map.id} colorByType={findUnitTypefromId(map.type, props.unitTypeData)} />
                ))}

            </div>
    }
    if (unitTypeView === 'Task Status') {
        const sortedTaskStatusData = taskStatusData.slice().sort((a, b) => a.id - b.id);

        content =
            <div className='flex gap-4 flex-wrap'>
                {sortedTaskStatusData.map(status => (
                    <FilterButton text={status.name} onClick={() => props.unitClick(status)} active={unitTypeView === 'Task Status' && props.selectedItem?.id === status.id} colorByType='Task Status' />
                ))}

            </div>
    }

    return (
        <div className='flex flex-col'>
            <br/>
            <div className='flex gap-4 flex-wrap'>
                {unitButtons}
            </div>
            <br />
            {content}

        </div>
    );
};
export default OrganizationView;
