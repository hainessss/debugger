const express = require('express');
const redis = require('./src/redis.js');
const socket = require('./src/socket.js');
const logger = require('./src/logger.js');
const app = require('./src/app.js');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

const init = async () => {
    const exp           = express();
    const server        = exp.listen(PORT, HOST);
    const socketGatway  = socket.start('/connect', server);
    const redisClient   = await redis.connect('events');
    const sockets$      = socketGatway.subscribe('connection');
    const events$       = redis.subscribe('message');
    
    return {
        server,
        redis: redisClient,
        socketGatway,
        socketStream: sockets$,
        eventStream: events$
    };
}

const startService = init().then((service) => {
    app(service, logger);
    logger.log('info', `Running on http://${HOST}:${PORT}`);
}).catch((err) => {
    logger.log('error', `Service failed to start ${err.message}`);
    process.exit(1);
});

