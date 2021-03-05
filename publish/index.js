const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const keys = require('./keys');

// Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Redis Client Setup
const redis = require('redis');
const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});
const redisPublisher = redisClient.duplicate();

// routes
app.get('/', (req, res) => {
    res.send('Welcome to publisher!');
})

app.post('/publish/:topic', async (req, res) => {
    try {
        const { topic } = req.params;
        const { data } = req.body;
        
        if (typeof data !== 'object' || data === null) {
            return res.status(422).json({ message: 'Invalid object supplied' });
        }
    
        const dataBuffer = Buffer.from(JSON.stringify(data));
        const success = await redisPublisher.publish(topic, dataBuffer);
        if (success) {
            return res.send({ success, topic, message: `TOPIC: ${topic} published` })
        }
        return res.status(400).send({ success, topic, message: `Error publushing the TOPIC: ${topic}` })
    } catch (error) {
        console.log({ error })
        res.status(400).send({ success, topic, message: `Oops..., an error occurred` })
    }
});

app.listen(keys.serverPort || 8000, () => {
    console.log(`Publisher running on PORT: ${keys.serverPort}`);
});
