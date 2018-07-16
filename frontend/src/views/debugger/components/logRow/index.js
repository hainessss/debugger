import React, { Component } from 'react';
import Flexbox from 'flexbox-react';
import { Text, CheckCircleIcon, Heading } from 'evergreen-ui'
import get from 'lodash/get';
import format from 'date-fns/format';
import './index.css';

class LogRow extends Component {
    render() {
        const { event } = this.props;
        const { receivedAt, type, description} = event;

        return (
            <Flexbox className="log-row" alignItems="center" height="50px" justifyContent="space-between">
                <Flexbox alignItems="center" flexBasis="75%">
                    <Flexbox marginLeft="-8px">
                        <CheckCircleIcon color="#016cd1" />
                    </Flexbox>
                    <Flexbox flexGrow={1} flexBasis="15%" paddingLeft="16px" paddingRight="16px">
                        <Heading fontFamily="display" size={400}>{type}</Heading>
                    </Flexbox>
                    <Flexbox flexGrow={3} flexBasis="85%">
                        <Text className="event-description" fontFamily="ui" size={300}>{description}</Text>
                    </Flexbox>
                </Flexbox>
                <Flexbox>
                    <Text fontFamily="ui" size={300}>{receivedAt}</Text>
                </Flexbox>
            </Flexbox>
        );
    }
}

export default LogRow;
