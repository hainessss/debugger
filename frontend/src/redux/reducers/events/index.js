export default (state = [], action) => {
    switch (action.type) {
      case 'ADD_EVENT':
        return [
            ...state,
            action.event
        ].slice(0, 1000); //max queue length before events will be lost
      case 'CONSUME_EVENT':
        return state.slice(1);
      default:
        return state
    }
};

export const getEventQueueLength = (state) => {
    return state.length;
}

export const getNextEvent = (state) => {
    return state.slice(0,1)[0];
}