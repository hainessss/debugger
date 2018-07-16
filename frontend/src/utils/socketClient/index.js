class Socket {
    constructor() {
        this.client = null;
    }

    connect(url) {
        this.client = new WebSocket(url);
    }
}

export default new Socket();