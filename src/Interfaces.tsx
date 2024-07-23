//SEPARATE THIS FILE

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

export interface Milestone extends Unit { //MIGHT NEED TO CHANGE THESE TO DISCRIMINANT UNIONS
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


export const formatDateNumericalMMDD = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so we add 1
    const daya = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${month}/${daya}`;

    return formattedDate;
};

export const formatDateNumericalMMDDYYYY = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so we add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString(); // Get full year YYYY

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
};

export const formatDateNumericalYYYYMMDDWithDashes = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-indexed, so we add 1
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString(); // Get full year YYYY

    const formattedDate = `${year}-${month}-${day}`;
    return formattedDate;
};

export const formatDateWords = (date: Date): string => {
    const months = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"];

    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
}

export function addDaysToDate(date: Date, daysToAdd: number): Date {
    const newDate = new Date(date);

    const currentDay = newDate.getDate();

    newDate.setDate(currentDay + daysToAdd);

    return newDate;
}

export function findIdForUnitType(type: string, unitTypes: UnitType[]) {
    return unitTypes.find(item => item.name === type)?.id
}

export function findUnitTypefromId(id: number, unitTypes: UnitType[]) {
    const name = unitTypes.find(item => item.id === id)?.name
    return name;
}

export interface ColorSet {
    default: string;
    hover: string;
    focusRing: string;
    selected: string;
}

export const colorSets: Record<string, ColorSet> = {
    blueLite: {
        default: 'bg-cerulean text-white',
        hover: 'hover:bg-yinmn-blue hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-cerulean focus:ring focus:text-white',
        selected: 'bg-oxford-blue text-white',
    },
    blue: {
        default: 'bg-yinmn-blue text-white',
        hover: 'hover:bg-cerulean hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-yinmn-blue focus:ring focus:text-white',
        selected: 'bg-oxford-blue text-white',
    },
    green: {
        default: 'bg-ash-gray text-white',
        hover: 'hover:bg-sage hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-bg-dark-moss-green focus:ring focus:text-white',
        selected: 'bg-dark-moss-green text-white',
    },
    blueWhite: {
        default: 'bg-white text-smoky-black',
        hover: 'hover:bg-cerulean hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-yinmn-blue focus:ring focus:text-white',
        selected: 'bg-yinmn-blue text-white',
    },
    purple: {
        default: 'bg-chinese-violet text-white',
        hover: 'hover:bg-mountbatten-pink hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-chinese-violet focus:ring focus:text-smoky-black',
        selected: 'bg-english-violet text-white focus:text-white',
    },
    orange: {
        default: 'bg-tigers-eyes text-smoky-black',
        hover: 'hover:bg-persian-orange hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-tigers-eyes focus:ring focus:text-smoky-black',
        selected: 'bg-burnt-orange text-white',
    },
    red: {
        default: 'bg-imperial-red text-smoky-black',
        hover: 'hover:bg-light-coral hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-imperial-red focus:ring focus:text-smoky-black',
        selected: 'bg-persian-red text-white',
    },
    yellow: {
        default: 'bg-vanilla text-smoky-black',
        hover: 'hover:bg-light-cream hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-vanilla focus:ring focus:text-smoky-black',
        selected: 'bg-straw text-white',
    },
    pink: {
        default: 'bg-sky-magenta text-smoky-black',
        hover: 'hover:bg-light-coral hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-amaranth-pink focus:ring focus:text-smoky-black',
        selected: 'bg-chinese-rose text-white',
    }

};


export function toCamelCase(input: string): string {
    const words = input.split(' ');

    const camelCased = words.map((word, index) => {
        if (index === 0) {
            return word.toLowerCase();
        } else {
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }
    });

    return camelCased.join('');
}

export type FilterStates = {
    roadmapFilterState: string[];
    taskStatusFilterState: string[];
    tagFilterState: string[];
};

export type ViewData = {
    taskData: Task[];
    unitClick: (unit: UnitDataType) => void;
    selectedItem: UnitDataTypeWithNull;
    unitTypeData: UnitType[];
    filterStates: FilterStates;
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

export const taskSortByEarliestDate = (taskData: Task[], useStartDate: boolean) => {
    const filteredTasks = taskData.sort((a, b) => {
        const firstDate = useStartDate ? a.startDate : a.endDate;
        const secondDate = useStartDate ? b.startDate : b.endDate;

        return new Date(firstDate).getTime() - new Date(secondDate).getTime();
    });
    return filteredTasks;
}

export function unitSortByNameAlphabetical<T extends Unit[]>(items: T): T {
    return items.sort((a, b) => {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
    });
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

export const milestoneSortByEarliestDate = (milestoneData: Milestone[]): Milestone[] => {
    const filteredMilestones = milestoneData.sort((a, b) => {
        return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
    return filteredMilestones;
}