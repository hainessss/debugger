import React, { Component } from 'react';
import { connect } from 'react-redux'
import SearchBar from './components/searchBar';
import LogRow from './components/logRow';
import get from 'lodash/get';
import debounce from 'lodash/debounce';
import textSearch from '../../utils/textSearch';
import withSocket from '../../containers/withSocket';
import * as actions from '../../redux/actions/events';
import {getEventQueueLength, getNextEvent} from '../../redux/reducers';
import {propsEqual} from 'react-shallow-equal';
import './index.css';


class Debugger extends Component {
    constructor(props) {
        super(props);

        this.state = {
            filter: "",
            isPaused: false,
            filteredEvents: [],
            events: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //only rerender on state change
        return !propsEqual(this.state, nextState);
    }

    componentWillMount() {
        const {socket, queueEvent, consumeEvent} = this.props;
        const _this = this;
        
        socket.onmessage = (message) => {
            const { isPaused } = _this.state;
            const event = JSON.parse(get(message, 'data'));
            const {filteredEvents} = _this.state;
            
            //add to redux
            if (isPaused) {
                queueEvent(event); //add to redux queue if the server buffer is dequeueing 
            } else {
                queueEvent(event);
                this.setState({
                    filteredEvents: [
                        this.props.nextEvent,
                        ...filteredEvents
                    ]
                });
                consumeEvent(); //enqueue new message. dequeue next in line
            }
        };
    }

    handleSearch = (e) => {
        const {events}  = this.state;
        const value     = get(e, 'target.value');
   
        this.setState({
            filter: value
        })
    }

    handleClick = (nextPause) => {
        const { isPaused } = this.state;
        const {socket} = this.props;

        if (nextPause !== isPaused) {
            this.setState({
                isPaused: nextPause
            });

            socket.send(JSON.stringify({
                "type": "pause",
                "isPaused": nextPause
            }));
        }
    }

    render() {
        const {filteredEvents, isPaused, filter} = this.state;

        return (
            <div>
                <SearchBar onClick={this.handleClick} isPaused={isPaused} onChange={debounce(this.handleSearch, 200)} />
                {
                    textSearch(filteredEvents, filter).map((event) => {
                        return (
                            <LogRow key={event.messageId} event={event}></LogRow>
                        );
                    })
                }
            </div>
        );
    }
}

const mapStateToProps = state => ({
    events: state.events,
    eventQueueLength: getEventQueueLength(state),
    nextEvent: getNextEvent(state)
})


export default connect(
    mapStateToProps,
    actions
)(withSocket(Debugger));
