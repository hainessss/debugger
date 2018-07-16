const { Observable, Subject } = require('rxjs');
const get = require('lodash/get');
const EventLog = require('./EventLog.js');
require('rxjs/add/operator/mergeMap');
require('rxjs/add/operator/map');
require('rxjs/add/operator/mergeAll');
require('rxjs/add/operator/buffer');
require('rxjs/add/operator/takeUntil');
require('rxjs/add/operator/delay');
require('rxjs/add/operator/switchMap');
require('rxjs/add/operator/concatMap');
require('rxjs/add/operator/catch');
require('rxjs/add/observable/fromEvent');

module.exports = (service, logger) => {
    service.socketStream.map((socket) => {
        socket.isPaused = false;//set intial pause state

        const disconnect$ = Observable.fromEvent(socket, 'close').mergeMap((closeEvent) => {
            return Observable.of(closeEvent);
        }).catch((err) => {
            logger.log('error', err.message);
            return Observable.of(err);
        }); //stream close events for each socket

        const message$ = Observable.fromEvent(socket, 'message').map((message) => {
            const data = JSON.parse(get(message, 'data', '{}'));
            const type = get(data, 'type');

            switch (type) {
                case "pause":
                    socket.isPaused = data.isPaused;
                    pauser.next(socket.isPaused);
                    break
                default:
                    console.log(message);
                    break;
            }
        }).catch((err) => {
            logger.log('error', err.message);
            return Observable.of(err);
        }).subscribe(); //stream recieved messages for each socket

        const pauser = new Subject(); //subject to keep state of pause stream
        const buffer = new Subject(); //subject to keep buffer state
        const source = new Subject(); //subject to keep stream state

        service.eventStream.subscribe(source);

        source
            .buffer(pauser) //buffer events; buffer will emit events when pauser emits
            .mergeAll()
            .subscribe(buffer); // feed events to buffer stream

        const pausableBuffered = pauser.switchMap((paused) => {
            return paused ? buffer : source;
        }); //toggle between live source and buffered values 

        pausableBuffered.concatMap((events) => {
            return Observable.of(new EventLog(events[1])).delay(1000);
        }).takeUntil(disconnect$).subscribe((event) => {
            socket.send(event.toJSON());
        }); //send to client

        pauser.next(false); //supply initial value
    }).catch((err) => {
        logger.log('error', err.message);
        return Observable.of(err);
    }).subscribe();
}