import React, { useState, useEffect } from 'react';

function Dashboard () {

    const [status, setStatus] = useState('Loading')

    useEffect(() => {
        fetch('http://localhost:5000/api/health')
            .then(response => response.json())
            .then(data => setStatus(data.message))
    }, [])

    return (
        <>
        
            <div>
                <h1>{status}</h1>
            </div>

        </>
    )
}

export default Dashboard;