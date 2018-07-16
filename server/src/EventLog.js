
const format =  require('date-fns/format');

//event.event || title  || event.userId
class EventLog {
    constructor(eventJson) {
        const {type, receivedAt, properties = {}, event,  userId, messageId} = JSON.parse(eventJson);

        this.type = type;
        this.messageId = messageId;
        this.receivedAt = receivedAt;
        this.description = event || properties.title || userId || "Unknown Event";
    }

    toJSON() {
        return JSON.stringify({
            ...this,
            receivedAt: format(this.receivedAt, 'YYYY/MM/DD HH:mm:ss')
        })
    }
}

module.exports = EventLog;