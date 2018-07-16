export const queueEvent = event => ({
    type: 'ADD_EVENT',
    event
});

export const consumeEvent = () => ({
    type: 'CONSUME_EVENT'
});

//   ​
//   export const setVisibilityFilter = filter => ({
//     type: 'SET_VISIBILITY_FILTER',
//     filter
//   })