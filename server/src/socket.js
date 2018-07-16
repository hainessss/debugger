const ws = require('ws');
const { Observable } = require('rxjs');
require('rxjs/add/observable/fromEvent');
require('rxjs/add/observable/of');


class SocketGateway {
    constructor() {
        // this.connection = redis.createClient({host: 'redis'});
        this.wws;
    }

    start(path, server) {
        this.wss = new ws.Server({ server, path });
        return this;
    }

    subscribe(eventName) {
        return Observable.fromEvent(this.wss, eventName).mergeMap((event) => {
            return Observable.of(event[0]);
        });
    }

    close(closed) {
        // to do: close socket gateway
    }
}

module.exports = new SocketGateway();