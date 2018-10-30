import React, { Component } from 'react';
import UserTable from './tableUserList';

import './index.scss';

export default class ManageUserView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="manage-user-view-container">
                <div className="row">
                    <div className="col-12">
                        <UserTable />
                    </div>
                </div>
            </div>
        );
    }
}
