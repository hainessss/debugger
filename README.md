# Description

A debugger for a stream of redis pub/sub events.

# Usage

Git clone this repo:

```https://github.com/hainessss/debugger.git```

install deps:

```
    cd debugger/server
    npm install
    cd ../frontend
    npm install
```

start server/redis:

```
    cd ..
    docker-compose up
```

start frontend:

```
    cd frontend
    npm start
```

test 

```
    cd frontend
    npm test
```

# Retrospective

## Strategy

To deal with the fast stream of events being published by Redis, I decided to use RxJs Observables because I thought that the powerful operators available in the library would make dealing with the back pressure a breeze. This turned out to only be partially true.  Though it was easy to coerce websocket and redis events into streams and get the basic funtionality in place, the pause feature was pretty hard to implement with the basic opertors. The app takes in a stream of socket connections and for each connection returns a stream of event messages from redis.  Because the redis event stream does not let up, a buffer stream continously collects values and another stream of messages, sent from the client, toggles whether events are read from the buffer or the live event stream. Because 100 events per second is too fast to be useful for a human readable UI, a second delay is put on each message. This caused a problem because it stopped the buffer from emiting all of its values at once; meaning that if a user paused the debugger consecutive times, the events would continue to roll in as the buffer emptied slowly. To fix this I created another queue using redux on the frontend to store the values as they came in to be displayed at a later time. 

## To be done

There are some omitions/drawbacks with this current version of the debugger that I did not implement based on time restraints.  Here are some things for the backlog:

* Implement a websocket heartbeat. The client doesn't always have time to let the server know about closed connections; a heartbeat can be used to make the server aware of closed connections and clean them from memory. It also serves to keep connections alive if the load balancer/reverse-proxy has a timeout in place.  

* Buffer management on server. Right now if the user pauses the debugger from the client the buffer will continuely queue up event messages. Logic needs to be added to manage the buffer length.

* Similarly, on the frontend there is no logic to cap the amount of messages that are being rendered. Implementing a virtualized table would be advised for displaying long lists like this. But logic is needed to cap the amount of messages stored in memory as well.  

* Notify users of the state of the websocket connection and queue.  Use toasts or message bars to let the user know of lost connections or stale queues. 

* Right now the logic for coercing event messages into objects for the UI to display is not very modular. Would be better to have a schema for each type (page, indentify, track) of event which the EventLog class could use to instatiate instances.  

* Add a React error boundary to the frontend to more gracefully handle errors.

* More tests. I added tests for the object text search function I made for reference.  


## An alternative 

While learning up on Redis, I discoverd a new data store called Redis Streams. Streams are a collection of objects indexed by a time based ID. Because the cadence of the event stream is so fast, I think using Redis Streams as a log store makes more sense than trying to stream events to a client. Events could be stored in a Redis Stream and users would be able to make percise queries based on time. I.e. give me all the logs of type X that happend in the last 5 minutes.  Streams can also be queried for events that are going to happen in the future, so real-time streaming is also a possiblity with this structure.  This takes all storage and through-put pressure off of the client and server and really just leaves managing redis stores as the only block to scalability.  I am assuming these logs are relatively ephemeral; streams could be removed after a certain time period (24, 48 hours). 



