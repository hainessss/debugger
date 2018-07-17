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
            events: []
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        //only rerender on state change
        return !propsEqual(this.state, nextState);
    }

    componentWillMount() {
        const {socket, queueEvent, consumeEvent} = this.props;

        
        socket.onmessage = (message) => {
            const { isPaused } = this.state;
            const event = JSON.parse(get(message, 'data'));
            const {events} = this.state;
            
            //add to redux
            if (isPaused) {
                queueEvent(event); //add to redux queue if the server buffer is dequeueing 
            } else {
                queueEvent(event);
                this.setState({
                    events: [
                        this.props.nextEvent,
                        ...events
                    ]
                });
                consumeEvent(); //enqueue new message. dequeue next in line
            }
        };
    }

    handleSearch = (e) => {
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
        const {events, isPaused, filter} = this.state;

        return (
            <div>
                <SearchBar onClick={this.handleClick} isPaused={isPaused} onChange={debounce(this.handleSearch, 200)} />
                {
                    textSearch(events, filter).map((event) => {
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
    eventQueueLength: getEventQueueLength(state),
    nextEvent: getNextEvent(state)
})


export default connect(
    mapStateToProps,
    actions
)(withSocket(Debugger));
