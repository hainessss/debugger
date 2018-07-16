const redis = require('redis');
const { Observable } = require('rxjs');
require('rxjs/add/observable/fromEvent');


class RedisClient {
    constructor() {
        this.connection;
    }

    connect(channelName, connected) {
        return new Promise((onResolve, onReject) => {

            this.connection = redis.createClient({
                    host: 'redis',
                    retry_strategy: () => {
                        onReject(new Error('Failed to connect to Redis.'))
                    }
            });
   

            this.connection.subscribe(channelName, (err) => {
                if (err) {
                  onReject(err);
                }

                console.log('reddis joined')
                onResolve(this);
            });   
        });
    }
    

    subscribe(eventName) {
        return Observable.fromEvent(this.connection, eventName);
    }

    close(closed) {
        this.connection.quit();
    }
}

module.exports = new RedisClient();