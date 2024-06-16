
import React from "react";

function TimelineView() {
    const [data, setData] = React.useState(null);

/*    React.useEffect(() => {
        fetch("/group")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, [])*/

    return (
        <div>
            <h1>TIMELINE VIEW</h1>
        </div>
    );
}


export default TimelineView;