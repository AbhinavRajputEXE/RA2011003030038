// Import required modules
const express = require('express'); // Import the Express.js framework
const app = express(); // Create an Express application
const axios = require('axios'); // Import Axios for making HTTP requests
const port = 8080; // Define the port for the server to listen on

// Define constant variables for various information
const companyName = "Abhinav_Rajput"; // Company name
const clientID = "b5b1ee66-3359-4dbf-a3fa-69340ebba552"; // Client ID for authentication
const clientSecret = "rFfIKlRlacSEDIvu"; // Client secret for authentication
const ownerName = "Abhinav"; // Owner's name
const ownerEmail = "ar1292@srmist.edu.in"; // Owner's email
const rollNo = "RA2011003030038"; // Owner's roll number

app.use(express.json()); // Set up JSON parsing middleware

// Define a route for handling incoming GET requests at the root path
app.get('/', async (req, res) => {
    const currentTime = new Date(); // Get the current time

    try {
        // Request authentication from the external service
        const authResponse = await axios.post('http://20.244.56.144/train/auth', {
            companyName,
            clientID,
            ownerName,
            ownerEmail,
            rollNo,
            clientSecret
        });

        // Extract necessary data from the authentication response
        const { token_type, access_token, expires_in } = authResponse.data;

        // Request train information from the external service using the obtained access token
        const trainsResponse = await axios.get('http://20.244.56.144/train/trains', {
            headers: {
                Authorization: `Bearer ${access_token}` // Include the access token in the request headers
            }
        });

        // Filter trains based on departure time
        const filteredTrains = trainsResponse.data.filter((train) => {
            const departureTime = new Date();
            departureTime.setHours(train.departureTime.Hours);
            departureTime.setMinutes(train.departureTime.Minutes);
            departureTime.setSeconds(train.departureTime.Seconds);

            // Consider trains departing at least 30 minutes from the current time
            return departureTime.getTime() > currentTime.getTime() + 30 * 60 * 1000;
        });

        // Sort filtered trains based on specific criteria
        const sortedTrains = filteredTrains.sort((train1, train2) => {
            // Compare train prices
            const price1 = Math.min(train1.price.sleeper, train1.price.AC);
            const price2 = Math.min(train2.price.sleeper, train2.price.AC);
            if (price1 !== price2) {
                return price1 - price2;
            }

            // Compare available tickets
            const tickets1 = train1.seatAvailable.sleeper + train1.seatAvailable.AC;
            const tickets2 = train2.seatAvailable.sleeper + train2.seatAvailable.AC;
            if (tickets1 !== tickets2) {
                return tickets2 - tickets1;
            }

            // Compare departure times considering delays
            const departureTime1 = new Date();
            departureTime1.setHours(train1.departureTime.Hours);
            departureTime1.setMinutes(train1.departureTime.Minutes);
            departureTime1.setSeconds(train1.departureTime.Seconds);
            departureTime1.setMinutes(departureTime1.getMinutes() + train1.delayedBy);

            const departureTime2 = new Date();
            departureTime2.setHours(train2.departureTime.Hours);
            departureTime2.setMinutes(train2.departureTime.Minutes);
            departureTime2.setSeconds(train2.departureTime.Seconds);
            departureTime2.setMinutes(departureTime2.getMinutes() + train2.delayedBy);

            return departureTime1.getTime() - departureTime2.getTime();
        });

        // Send the sorted train information as a response
        res.status(200).send(sortedTrains);

    } catch (error) {
        console.error(error); // Log any errors that occur
        res.status(500).send('Server error'); // Send a 500 response in case of errors
    }
});

// Start the server and listen on the specified port
app.listen(port, () => console.log(`Server started on port ${port}`));
