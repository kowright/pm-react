import React from 'react';
import FilterButton from './FilterButton';
interface SortAreaProps {
    unitOfSort: string;
    sortState: {
        taskSortState: string[],
        milestoneSortState: string[]
    };
    handleSort: (sort: string) => void;
}

export const SortArea = (props: SortAreaProps) => {

    return (
        <div className='px-2'>
            {props.unitOfSort === 'Task' && (
                <div className='flex gap-x-4 gap-y-2 flex-wrap'>
                    <FilterButton text='Sort Alphabetically' active={props.sortState.taskSortState.includes("Alphabetical")} onClick={() => props.handleSort('Alphabetical')} />
                    <FilterButton text='Sort By Start Date' active={props.sortState.taskSortState.includes("EarliestStartDate")} onClick={() => props.handleSort('EarliestStartDate')} />
                    <FilterButton text='Sort By End Date' active={props.sortState.taskSortState.includes("EarliestEndDate")} onClick={() => props.handleSort('EarliestEndDate')} />
                </div>
            )}

            {props.unitOfSort === 'Milestone' && (
                <div className='flex gap-x-4 gap-y-2 flex-wrap'>
                    <FilterButton text='Sort Alphabetically' active={props.sortState.milestoneSortState.includes("Alphabetical")} onClick={() => props.handleSort('Alphabetical')} />
                    <FilterButton text='Sort By Date' active={props.sortState.milestoneSortState.includes("EarliestDate")} onClick={() => props.handleSort('EarliestDate')} />
                </div>
            )}
        </div>
    );

};

