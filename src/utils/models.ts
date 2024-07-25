export type UnitDataTypeWithNull = Task | Milestone | Tag | Assignee | null;
export type UnitDataType = Task | Milestone | Tag | Assignee;

export interface UnitAPIData {
    taskData: Task[];
    milestoneData: Milestone[];
    tagData: Tag[];
    assigneeData: Assignee[];
    unitTypesData: UnitType[];
    roadmapData: Roadmap[];
}

export interface Unit {
    name: string;
    description: string;
    type: number;
    id: number;
}

export interface UnitType {
    id: number;
    name: string;
}

export interface Milestone extends Unit { 
    date: Date;
    taskStatus: TaskStatus;
    roadmaps: Roadmap[];
    tags: Tag[];
}

export interface Task extends Unit {
    duration: number;
    roadmaps: Roadmap[],
    tags: Tag[];
    assignee: Assignee,
    startDate: Date,
    endDate: Date,
    taskStatus: TaskStatus,
    id: number,
}
export interface TaskStatus extends Unit {
    name: string;
    description: string;
}

export interface Roadmap extends Unit {
    name: string;
    description: string;
    milestones: Milestone[];
    tags: Tag[];
    id: number;
}

export interface Assignee extends Unit {
    name: string;
    //role
}
export interface Tag extends Unit {
    name: string;
    description: string;
}

export type FilterStates = {
    roadmapFilterState: string[];
    taskStatusFilterState: string[];
    tagFilterState: string[];
    assigneeFilterState: string[];
};

export type SortStates = {
    taskSortState: string[];
    milestoneSortState: string[];
};

export type ViewData = {
    taskData: Task[];
    unitClick: (unit: UnitDataType) => void;
    selectedItem: UnitDataTypeWithNull;
    unitTypeData: UnitType[];
    filterStates: FilterStates;
    setShowFilterAreaAssignees: (showAssignees: boolean) => void;
}
