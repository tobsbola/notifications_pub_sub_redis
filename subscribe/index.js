const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const redis = require('redis');
const keys = require('./keys');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000,
})

// Express
const app = express();
app.use(cors());
app.use(bodyParser.json());

// routes
app.post('/subscribe/:topic', async (req, res) => {
    try {
        const { url } = req.body;
        const { topic } = req.params;

        if (!url) {
            return res.status(422).json({ message: 'Please supply a url' });
        }
        
        const sub = redisClient.duplicate();
        sub.on('message', (channel, message) => {
            console.log(`MessageReceived, ${channel}: ${message}`)
        });
        sub.subscribe(topic);

        res.send({ url, topic, message: `subscribed to TOPIC: (${topic}) successfully` })
    } catch (error) {
        console.log({ error })
        res.status(400).json({ url, topic, message: `Oops..., an error occurred` })
    }
});

app.listen(keys.serverPort || 9000, () => {
    console.log(`Subscriber running on PORT: ${keys.serverPort}`);
});

