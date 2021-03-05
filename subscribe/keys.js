module.exports = {
    serverPort: process.env.PORT || 9000,
    redisHost: process.env.REDIS_HOST || '127.0.0.1',
    redisPort: process.env.REDIS_PORT || 6379,
}