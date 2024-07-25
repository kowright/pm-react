import { FilterStates, Milestone, SortStates, Task, Unit } from "./models";

// #region Tasks

//FILTER
export function filterTasks(taskData: Task[], filters: FilterStates) {
    let filteredTasks = taskFilterOnTaskStatus(taskData, filters.taskStatusFilterState);
    filteredTasks = taskFilterOnRoadmap(filteredTasks, filters.roadmapFilterState);
    filteredTasks = taskFilterOnTag(filteredTasks, filters.tagFilterState);
    filteredTasks = taskFilterOnAssignee(filteredTasks, filters.assigneeFilterState);

    return filteredTasks;
}

export const taskFilterOnTaskStatus = (taskData: Task[], taskStatusFilterState: string[]): Task[] => {
    const filteredTasks = taskStatusFilterState && taskStatusFilterState.length > 0
        ? taskData.filter(task => taskStatusFilterState.includes(task.taskStatus.name))
        : taskData;
    return filteredTasks;
}

export const taskFilterOnRoadmap = (taskData: Task[], roadmapFilterState: string[]): Task[] => {
    const filteredTasks = taskData.filter(task => {
        const taskRoadmapNames = task.roadmaps.map(map => map.name);
        return roadmapFilterState.every(name => taskRoadmapNames.includes(name)); //AND
        // return props.roadmapFilterState.some(name => taskRoadmapNames.includes(name)); //OR
    });
    return filteredTasks;
}

export const taskFilterOnTag = (taskData: Task[], tagFilterState: string[]): Task[] => {
    const filteredTasks = taskData.filter(task => {
        const taskTagNames = task.tags.map(tag => tag.name);
        return tagFilterState.every(name => taskTagNames.includes(name)); //AND
        // return props.roadmapFilterState.some(name => taskRoadmapNames.includes(name)); //OR
    });
    return filteredTasks;
}

export const taskFilterOnAssignee = (taskData: Task[], assigneeFilterState: string[]): Task[] => {
    const filteredTasks = assigneeFilterState && assigneeFilterState.length > 0
        ? taskData.filter(task => assigneeFilterState.includes(task.assignee.name))
        : taskData;
    return filteredTasks;
}

//SORT

export function sortTasks(filteredTasks: Task[], sortState: SortStates) {
    if (sortState.taskSortState.includes('EarliestStartDate')) {
        filteredTasks = taskSortByEarliestDate(filteredTasks, true);
    }
    if (sortState.taskSortState.includes("EarliestEndDate")) {
        filteredTasks = taskSortByEarliestDate(filteredTasks, false);
    }
    if (sortState.taskSortState.includes("Alphabetical")) {
        unitSortByNameAlphabetical(filteredTasks);
    }

    return filteredTasks;
}

export const taskSortByEarliestDate = (taskData: Task[], useStartDate: boolean) => {
    const filteredTasks = taskData.sort((a, b) => {
        const firstDate = useStartDate ? a.startDate : a.endDate;
        const secondDate = useStartDate ? b.startDate : b.endDate;

        return new Date(firstDate).getTime() - new Date(secondDate).getTime();
    });

    return filteredTasks;
}

// #endregion

// #region Milestones

//FILTER

export function filterMilestones(milestoneData: Milestone[], filters: FilterStates) {
    let filteredMilestones = milestoneFilterOnTaskStatus(milestoneData, filters.taskStatusFilterState);
    filteredMilestones = milestoneFilterOnRoadmap(filteredMilestones, filters.roadmapFilterState);
    filteredMilestones = milestoneFilterOnTag(filteredMilestones, filters.tagFilterState);

    return filteredMilestones;
}

export const milestoneFilterOnTaskStatus = (milestoneData: Milestone[], taskStatusFilterState: string[]): Milestone[] => {
    const filteredMilestone = taskStatusFilterState && taskStatusFilterState.length > 0
        ? milestoneData.filter(ms => taskStatusFilterState.includes(ms.taskStatus.name))
        : milestoneData;
    return filteredMilestone;
}

export const milestoneFilterOnRoadmap = (milestoneData: Milestone[], roadmapFilterState: string[]): Milestone[] => {
    const filteredMilestones = milestoneData.filter(milestone => {
        const milestoneRoadmapNames = milestone.roadmaps.map(map => map.name);
        return roadmapFilterState.every(name => milestoneRoadmapNames.includes(name)); //AND
        // return roadmapFilterState.some(name => milestoneRoadmapNames.includes(name)); //OR
    });
    return filteredMilestones;
}

export const milestoneFilterOnTag = (milestoneData: Milestone[], tagFilterState: string[]): Milestone[] => {
    const filteredMilestones = milestoneData.filter(milestone => {
        const milestoneTagNames = milestone.tags.map(tag => tag.name);
        return tagFilterState.every(name => milestoneTagNames.includes(name)); //AND
        // return roadmapFilterState.some(name => milestoneRoadmapNames.includes(name)); //OR
    });
    return filteredMilestones;
}

//SORT

export const milestoneSortByEarliestDate = (milestoneData: Milestone[]): Milestone[] => {
    const filteredMilestones = milestoneData.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return filteredMilestones;
}

export function sortMilestones(filteredMilestones: Milestone[], sortStates: SortStates) {
    if (sortStates.milestoneSortState.includes('EarliestStartDate')) {
        filteredMilestones = milestoneSortByEarliestDate(filteredMilestones);
    }
    if (sortStates.milestoneSortState.includes("Alphabetical")) {
        unitSortByNameAlphabetical(filteredMilestones);
    }

    return filteredMilestones;
}

// #endregion

// #region General Sorts
export function unitSortByNameAlphabetical<T extends Unit[]>(items: T): T {
    return items.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
}

// #endregion