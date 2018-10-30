import React, { Component } from 'react';
import ReportTable from './tableList';

import './index.scss';

export default class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="manage-view-container">
                <div className="row">
                    <div className="col-12">
                        <ReportTable />
                    </div>
                </div>
            </div>
        );
    }
}
