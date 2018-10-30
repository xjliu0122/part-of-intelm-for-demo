import React, { Component } from 'react';
import ClientTable from './tableClientList';

import './index.scss';

export default class ManageUserView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="manage-view-container">
                <div className="row">
                    <div className="col-12">
                        <ClientTable />
                    </div>
                </div>
            </div>
        );
    }
}
