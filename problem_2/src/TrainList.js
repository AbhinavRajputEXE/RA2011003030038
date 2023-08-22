import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function TrainList() {
  const [trains, setTrains] = useState([]);

  // Use the useEffect hook to fetch train list when the component mounts
  useEffect(() => {
    // Make an HTTP GET request to the specified endpoint using axios
    axios.get('http://localhost:8080')
      .then(response => {
        // Update the state with the fetched list of trains
        setTrains(response.data);
      });
  }, []);

  return (
    <div className="container mt-5">
      {/* Map through the array of trains and display information for each */}
      {trains.map(train => (
        <div key={train.trainNumber} className="card mb-3">
          <div className="card-body">
            <h5 className="card-title">{train.trainName}</h5>
            <p className="card-text">Train Number: {train.trainNumber}</p>
            {/* Create a link to view more details about the train */}
            <Link to={`/train/${train.trainNumber}`} className="btn btn-primary">View More</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TrainList;
