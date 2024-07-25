import { UnitType } from "./models";

export const formatDateNumericalMMDD = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const daya = date.getDate().toString().padStart(2, '0');

    const formattedDate = `${month}/${daya}`;

    return formattedDate;
};

export const formatDateNumericalMMDDYYYY = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString();

    const formattedDate = `${month}/${day}/${year}`;

    return formattedDate;
};

export const formatDateNumericalYYYYMMDDWithDashes = (date: Date): string => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); 
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString(); 

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
