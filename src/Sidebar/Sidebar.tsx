import React from 'react';

interface SidebarProps {
    isTask: boolean;
    isMilestone: boolean;
    taskId: number;
}

/**
 * Primary UI component for user interaction
 */
export const Sidebar: React.FC<SidebarProps> = ({
    isTask = false,
    isMilestone = false,
    ...props
}: SidebarProps) => {
    const [data, setData] = React.useState<any>(null); // Use 'any' or specify the expected shape of data

    const hideContent = !isTask && !isMilestone;

    const fetchURL = `/api/tasks/${props.taskId}`; 

    React.useEffect(() => {
        fetch(fetchURL)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch((error) => console.error('Error fetching data:', error));
    }, [fetchURL, props.taskId]); // Ensure taskId is included in dependencies array

    if (!data) {
        return <div>Loading...</div>; // Handle loading state
    }

    function formatDateNumerical(date: Date | string): string {
        const formattedDate = typeof date === 'string' ? new Date(date) : date;

        // Check if formattedDate is a valid Date object
        if (!(formattedDate instanceof Date && !isNaN(formattedDate.getTime()))) {
            throw new Error('Invalid date provided');
        }

        // Extract year, month, and day
        const year = formattedDate.getFullYear();
        const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
        const day = String(formattedDate.getDate()).padStart(2, '0');

        // Return formatted date string
        return `${month}-${day}-${year}`;
    }



    return (
        <div>
            {hideContent ? (
                <div>No content to show</div> ) : (
                    <div className='w-full h-full bg-rose-700'>

                        {isTask &&
                            <div>
                                <h1>TASK DETAILS</h1>
                                <p>NAME: {data.task.name} </p>
                                <hr />
                                <p>DESCRIPTION: {data.task.description} </p>
                                <hr />
                                <p>ROADMAP(S): {data.task.roadmap} </p>
                                <hr />
                                <p>ASSIGNEE: {data.task.assignee} </p>
                                <hr />
                                <p>START DATE: {formatDateNumerical(data.task.startDate)} </p>
                                <hr />
                                <p>END DATE: {formatDateNumerical(data.task.endDate)} </p>
                                <hr />
                                <p>DURATION: {data.task.duration} </p>
                                <hr />
                                <p>TASK STATUS: {data.task.taskStatus} </p>
                                <hr />
                                <p>ID: {data.task.id} </p>
                            </div>
                        }



                        {isMilestone && <div>MILESTONING </div> }
                       

                    </div>
            )}
        </div>
    );
};
