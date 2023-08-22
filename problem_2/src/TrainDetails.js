import React, { useState, useEffect } from 'react';
import axios from 'axios';

function TrainDetails(props) {
  const [train, setTrain] = useState(null);

  // Use the useEffect hook to fetch train details when the component mounts or the train number changes
  useEffect(() => {
    // Make an HTTP GET request to the specified endpoint using axios
    axios.get(`http://localhost:8080/train/${props.match.params.trainNumber}`)
      .then(response => {
        // Update the state with the fetched train data
        setTrain(response.data);
      });
  }, [props.match.params.trainNumber]); // Dependency array ensures the effect is re-run when trainNumber changes

  // Display a loading message if train data is not yet fetched
  if (!train) return <div>Loading...</div>;

  return (
    <div className="container mt-5">
      {/* Display various train details */}
      <h1>{train.trainName}</h1>
      <p>Train Number: {train.trainNumber}</p>
      <p>Departure Time: {`${train.departureTime.Hours}:${train.departureTime.Minutes}:${train.departureTime.Seconds}`}</p>
      <p>Seats Available (Sleeper): {train.seatsAvailable.sleeper}</p>
      <p>Seats Available (AC): {train.seatsAvailable.AC}</p>
      <p>Price (Sleeper): ${train.price.sleeper}</p>
      <p>Price (AC): ${train.price.AC}</p>
      <p>Delayed By: {train.delayedBy} minutes</p>
    </div>
  );
}

export default TrainDetails;
