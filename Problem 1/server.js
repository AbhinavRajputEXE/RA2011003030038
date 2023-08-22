const express = require('express');
const app = express();
const axios = require('axios');
const port = 8080;

const companyName = "Abhinav_Rajput";
const clientID = "b5b1ee66-3359-4dbf-a3fa-69340ebba552";
const clientSecret = "rFfIKlRlacSEDIvu";
const ownerName = "Abhinav";
const ownerEmail = "ar1292@srmist.edu.in";
const rollNo = "RA2011003030038";
app.use(express.json());
app.get('/', async (req, res) => {
    const currentTime = new Date();

    try {
        const authResponse = await axios.post('http://20.244.56.144/train/auth', {
            companyName,
            clientID,
            ownerName,
            ownerEmail,
            rollNo,
            clientSecret
        });

        const { token_type, access_token, expires_in } = authResponse.data;
        const trainsResponse = await axios.get('http://20.244.56.144/train/trains', {
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        });
        const filteredTrains = trainsResponse.data.filter((train) => {
            const departureTime = new Date();
            departureTime.setHours(train.departureTime.Hours);
            departureTime.setMinutes(train.departureTime.Minutes);
            departureTime.setSeconds(train.departureTime.Seconds);
            return departureTime.getTime() > currentTime.getTime() + 30 * 60 * 1000;
        });
        const sortedTrains = filteredTrains.sort((train1, train2) => {
            const price1 = Math.min(train1.price.sleeper, train1.price.AC);
            const price2 = Math.min(train2.price.sleeper, train2.price.AC);
            if (price1 !== price2) {
                return price1 - price2;
            }
            const tickets1 = train1.seatAvailable.sleeper + train1.seatAvailable.AC;
            const tickets2 = train2.seatAvailable.sleeper + train2.seatAvailable.AC;
            if (tickets1 !== tickets2) {
                return tickets2 - tickets1;
            }
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
        res.status(200).send(sortedTrains);

    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});
app.listen(port, () => console.log(`Server started on port ${port}`));