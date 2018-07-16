import React, { Component } from 'react';
import Flexbox from 'flexbox-react';
import { SearchInput, Button } from 'evergreen-ui'
import classnames from 'classnames';
import './index.css';

class SearchBar extends Component {
    handleChange = (e) => {
        e.persist();
        const { onChange } = this.props;
        onChange(e);
    }

    render() {
        const { onClick, isPaused } = this.props;

        return (
            <Flexbox className="header" alignItems="center" height="60px">
                <Flexbox flexBasis={"150px"}>
                    <Button onClick={onClick.bind(null, false)} className={classnames("button-bar-btn", {"active": !isPaused})}>Live</Button>
                    <Button onClick={onClick.bind(null, true)} className={classnames("button-bar-btn", {"active": isPaused})}>Pause</Button>
                </Flexbox>
                <Flexbox flexGrow={3}>
                    <SearchInput width="100%" onChange={this.handleChange} placeholder="Type to search..." />
                </Flexbox>
            </Flexbox>
        );
    }
}

export default SearchBar;
