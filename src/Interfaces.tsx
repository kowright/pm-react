export interface Milestone { //MIGHT NEED TO CHANGE THESE TO DISCRIMINANT UNIONS
    name: string;
    description: string;
    date: Date;
    taskStatus: TaskStatus;
    id: number;
}

export interface Task {
    name: string,
    description: string,
    duration: number;
    roadmaps: Roadmap[],
    assignee: Assignee,
    startDate: Date,
    endDate: Date,
    taskStatus: TaskStatus,
    id: number,
}
export interface TaskStatus {
    name: string;
    description: string;
}

export interface Roadmap {
    name: string;
    description: string;
    milestones: Milestone[];
    tags: Tag[];
    id: number;
}

export interface Assignee {
    name: string;
    //role
}
export interface Tag {
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

export function addDaysToDate(date: Date, daysToAdd: number): Date {
    // Create a new Date object to avoid mutating the original date
    const newDate = new Date(date);

    const currentDay = newDate.getDate();

    newDate.setDate(currentDay + daysToAdd);

    return newDate;
}