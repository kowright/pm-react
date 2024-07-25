export type colorName =
    | 'blueLite'
    | 'blue'
    | 'gray'
    | 'blueWhite'
    | 'purple'
    | 'orange'
    | 'red'
    | 'yellow'
    | 'pink'
    | 'green';

interface ColorSet {
    default: string;
    hover: string;
    focusRing: string;
    selected: string;
}

export const colorSets: Record<colorName, ColorSet> = {
    blueLite: {
        default: 'bg-cerulean text-white',
        hover: 'hover:bg-yinmn-blue hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-cerulean focus:ring focus:text-white',
        selected: 'bg-oxford-blue text-white focus:text-white',
    },
    blue: {
        default: 'bg-yinmn-blue text-white',
        hover: 'hover:bg-cerulean hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-yinmn-blue focus:ring focus:text-white',
        selected: 'bg-oxford-blue text-white focus:text-white',
    },
    gray: {
        default: 'bg-ash-gray text-white',
        hover: 'hover:bg-sage hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-bg-dark-moss-green focus:ring focus:text-white',
        selected: 'bg-dark-moss-green text-white focus:text-white',
    },
    blueWhite: {
        default: 'bg-white text-smoky-black',
        hover: 'hover:bg-cerulean hover:text-white',
        focusRing: 'focus:ring-offset-4 focus:ring-yinmn-blue focus:ring focus:text-white',
        selected: 'bg-yinmn-blue text-white focus:text-white',
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
        selected: 'bg-burnt-orange text-white focus:text-white',
    },
    red: {
        default: 'bg-imperial-red text-smoky-black',
        hover: 'hover:bg-light-coral hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-imperial-red focus:ring focus:text-smoky-black',
        selected: 'bg-persian-red text-white focus:text-white',
    },
    yellow: {
        default: 'bg-vanilla text-smoky-black',
        hover: 'hover:bg-cream hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-vanilla focus:ring focus:text-smoky-black',
        selected: 'bg-pear text-smoky-black focus:text-smoky-black',
    },
    pink: {
        default: 'bg-sky-magenta text-smoky-black',
        hover: 'hover:bg-light-coral hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-amaranth-pink focus:ring focus:text-smoky-black',
        selected: 'bg-chinese-rose text-white focus:text-white',
    },
    green: {
        default: 'bg-dark-moss-green text-white',
        hover: 'hover:bg-moss-green hover:text-smoky-black',
        focusRing: 'focus:ring-offset-4 focus:ring-dark-moss-green focus:ring focus:text-smoky-black',
        selected: 'bg-drab-dark-brown text-white focus:text-white',
    },
};

export function getUnitColorSetName(name: string | undefined): colorName {
    const unitTypeToColor: Record<string, colorName> = {
        Tag: 'purple',
        Assignee: 'green',
        Roadmap: 'orange',
        'Task Status': 'pink',
        Task: 'yellow',
        Milestone: 'red',
    };

    return name && unitTypeToColor[name] ? unitTypeToColor[name] : 'green';
}