import React from "react";

function TableView() {
    const [data, setData] = React.useState(null);
    const [selectedRoadmap, setSelectedRoadmap] = React.useState('');

    const handleFilterByRoadmap = (roadmap) => {
        setSelectedRoadmap(roadmap); 
    };

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [])

    if (!data) {
        return <p>Loading...!</p>; // Render loading until data is fetched   
    }

    const filteredTasks = selectedRoadmap
        ? data.message.filter(task => task.roadmap === selectedRoadmap)
        : data.message;

    return (
        <div className='mx-8'>
                <h1>Table View</h1>
  
            <div className='flex gap-4 justify-center'>
                <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleFilterByRoadmap("Engineering Roadmap")}>Engineering Roadmap Tasks</button>
                <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleFilterByRoadmap("Design Roadmap")}>Design Roadmap Tasks</button>
                <button className='bg-cyan-400 rounded border border-cyan-200 p-2' onClick={() => handleFilterByRoadmap("")}>All Roadmaps</button>
            </div>
            <br />
                <table className="min-w-full border-collapse border border-gray-200">
                    <thead className="bg-gray-600">
                        <tr>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Description</th>
                            <th className="border border-gray-300 px-4 py-2">Duration</th>
                            <th className="border border-gray-300 px-4 py-2">Roadmap</th>
                            <th className="border border-gray-300 px-4 py-2">Assignee</th>
                            <th className="border border-gray-300 px-4 py-2">Start Date</th>
                            <th className="border border-gray-300 px-4 py-2">End Date</th>
                            <th className="border border-gray-300 px-4 py-2">Task Status</th>

                        </tr>
                    </thead>
                    <tbody>
                        {filteredTasks.map((item, index) => (
                            <tr key={index}>
                                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.duration}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.roadmap}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.assignee}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.startDate}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.endDate}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.taskStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}


export default TableView;