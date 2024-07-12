export type UnitData = Task | Milestone | Tag | Assignee | null;

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

export interface ColorSet {
    default: string;
    hover: string;
    focusRing: string;
    selected: string;
}

export const colorSets: Record<string, ColorSet> = {
    blueLite: {
        default: 'bg-cerulean text-white',
        hover: 'hover:bg-yinmn-blue text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-cerulean focus:ring text-white',
        selected: 'bg-oxford-blue text-white',
    },
    blue: {
        default: 'bg-yinmn-blue text-white',
        hover: 'hover:bg-cerulean text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-yinmn-blue focus:ring text-white',
        selected: 'bg-oxford-blue text-white',
    },
    green: {
        default: 'bg-ash-gray text-white',
        hover: 'hover:bg-sage text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-bg-dark-moss-green focus:ring text-white',
        selected: 'bg-dark-moss-green text-white',
    },
};
