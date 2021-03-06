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
    return res.json({ hi: 'publisher in here!' });
})

app.post('/publish/:topic', async (req, res) => {
    try {
        const { topic } = req.params;
        const data = req.body;
        
        if (Object.keys(data).length === 0) {
            return res.status(422).json({ message: 'Body parameter(s) required' });
        }

        if (typeof data !== 'object') {
            return res.status(422).json({ message: 'Body must be a valid object' });
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

module.exports = app;