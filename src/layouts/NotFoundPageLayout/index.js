import React, { Component } from 'react';
import _ from 'lodash';

import './index.scss';

class NotFoundPageLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="container">
                <h1>
                    Not found <span>:(</span>
                </h1>
                <p>
                    Sorry, but the page you were trying to view does not exist.
                </p>
                <p>It looks like this was the result of either:</p>
                <ul>
                    <li>a mistyped address</li>
                    <li>an out-of-date link</li>
                </ul>
            </div>
        );
    }
}

export default NotFoundPageLayout;
