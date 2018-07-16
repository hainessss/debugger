import { combineReducers } from 'redux';
import events, * as eventSelectors from './events';

export default combineReducers({
  events
})

export const getEventQueueLength = (state) => {
    return eventSelectors.getEventQueueLength(state.events);
};

export const getNextEvent = (state) => {
    return eventSelectors.getNextEvent(state.events);
};