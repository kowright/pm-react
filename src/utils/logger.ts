
const createLogger = (tag: string) => ({
    info: (...args: any[]) => console.log(`%c[${tag}] %cINFO:`, 'color: green;', 'color: black;', ...args),
    warn: (...args: any[]) => console.warn(`%c[${tag}] %cWARN:`, 'color: orange;', 'color: black;', ...args),
    error: (...args: any[]) => console.error(`%c[${tag}] %cERROR:`, 'color: red;', 'color: black;', ...args),
});

export default createLogger;
