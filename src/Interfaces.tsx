export interface Milestone {
    name: string;
    date: Date;
    roadmaps: string[];
    taskStatus: string;
}

export interface Task {
    id: number;
    name: string;
    description: string;
    duration: number;
    roadmap: string;
    assignee: string;
    startDate: string;
    endDate: string;
    taskStatus: string;
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
