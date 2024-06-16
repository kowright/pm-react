import logo from './logo.svg';

import React from "react";

function TableView() {
    const [data, setData] = React.useState(null);

    React.useEffect(() => {
        fetch("/api")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [])

    if (!data) {
        return <p>Loading...!</p>; // Render loading until data is fetched
    }

    return (
        <div className='mx-8'>
                <h1>Table View</h1>

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
                        {data.message.map((item, index) => (
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