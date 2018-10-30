import React, { Component } from 'react';
import { connect } from 'react-redux';
//React MD
import { Button, DialogContainer } from 'react-md';
import _ from 'lodash';

import moment from 'moment';

import LocationHelpView from 'components/LocationTooltip/locationTooltip';

import './jobDetail.scss';

class JobViewDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedJob: null,
        };
        if (this.props.job) {
            this.state = { selectedJob: { ...this.props.job } };
        }
    }
    render() {
        const { selectedJob } = this.state,
            { closeJobView } = this.props;

        return (
            selectedJob && (
                <DialogContainer
                    id="jobViewDetailDialogue"
                    visible
                    aria-labelledby="view detail"
                    focusOnMount={false}
                    modal
                >
                    <header className="modal-header">
                        {selectedJob &&
                            selectedJob.type === 'Import' && (
                            <h2 className="montserrat-bold">
                                    Job Details: Import / {selectedJob.name}
                            </h2>
                        )}
                        {selectedJob &&
                            selectedJob.type === 'Export' && (
                            <h2 className="montserrat-bold">
                                    Job Details: Export / {selectedJob.name}
                            </h2>
                        )}
                        {selectedJob &&
                            selectedJob.type === 'Cross Town' && (
                            <h2 className="montserrat-bold">
                                    Job Details: Cross Town / {selectedJob.name}
                            </h2>
                        )}
                        <Button icon primary onClick={closeJobView}>
                            close
                        </Button>
                    </header>
                    {selectedJob &&
                        selectedJob.type !== 'Cross Town' && (
                        <section className="job-detail-view-main-area">
                            <div className="row">
                                <div className="col-6">
                                    <label>Client Reference #:</label>
                                    <div>{selectedJob.clientRefNo}</div>
                                </div>
                                {selectedJob.type === 'Import' && (
                                    <div className="col-6">
                                        <label>BL #:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobImportDetail.billOfLading',
                                            )}
                                        </div>
                                    </div>
                                )}
                                {selectedJob.type === 'Export' && (
                                    <div className="col-6">
                                        <label>Booking #:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobExportDetail.booking',
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label>Shipper:</label>
                                    {selectedJob.type !== 'Import' && (
                                        <LocationHelpView
                                            location={selectedJob.shipper}
                                        />
                                    )}
                                    {selectedJob.type === 'Import' && (
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobImportDetail.shipper',
                                            )}
                                        </div>
                                    )}
                                </div>
                                <div className="col-6">
                                    <label>Consignee:</label>
                                    {selectedJob.type !== 'Export' && (
                                        <LocationHelpView
                                            location={selectedJob.consignee}
                                        />
                                    )}
                                    {selectedJob.type === 'Export' && (
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobExportDetail.consignee',
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {/* {selectedJob.type === 'Cross Town' && (
                                <div className="row">
                                    <div className="col-6">
                                        <label>Port:</label>
                                        <LocationHelpView
                                            location={selectedJob.port}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label>ETD:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobImportDetail.etaDate',
                                            )
                                                ? moment(selectedJob
                                                    .jobImportDetail
                                                    .etaDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )} */}
                            {selectedJob.type === 'Export' && (
                                <div className="row">
                                    <div className="col-6">
                                        <label>Port:</label>
                                        <LocationHelpView
                                            location={selectedJob.port}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label>ETD:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobExportDetail.dateOfDeparture',
                                            )
                                                ? moment(selectedJob
                                                    .jobExportDetail
                                                    .dateOfDeparture)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedJob.type === 'Import' && (
                                <div className="row">
                                    <div className="col-6">
                                        <label>Port:</label>
                                        <LocationHelpView
                                            location={selectedJob.port}
                                        />
                                    </div>
                                    <div className="col-6">
                                        <label>ETA:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobImportDetail.etaDate',
                                            )
                                                ? moment(selectedJob
                                                    .jobImportDetail
                                                    .etaDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div className="row">
                                <div className="col-12 remark">
                                    <label>Instructions:</label>
                                    <div>{selectedJob.remarks}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label>Marine Carrier #:</label>
                                    <div>
                                        {_.get(
                                            selectedJob,
                                            `job${
                                                selectedJob.type
                                            }Detail.marineCarrier`,
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label>Terminal:</label>
                                    <div>
                                        {_.get(
                                            selectedJob,
                                            `job${
                                                selectedJob.type
                                            }Detail.terminal`,
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-6">
                                    <label>Vessel Name:</label>
                                    <div>
                                        {_.get(
                                            selectedJob,
                                            `job${
                                                selectedJob.type
                                            }Detail.vesselName`,
                                        )}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label>Voyage #:</label>
                                    <div>
                                        {_.get(
                                            selectedJob,
                                            `job${
                                                selectedJob.type
                                            }Detail.voyageNumber`,
                                        )}
                                    </div>
                                </div>
                            </div>

                            {selectedJob.type === 'Import' && (
                                <div className="row">
                                    <div className="col-6">
                                        <label>Last Free Date(LFD):</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobImportDetail.lastFreeDate',
                                            )
                                                ? moment(selectedJob
                                                    .jobImportDetail
                                                    .lastFreeDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {selectedJob.type === 'Export' && (
                                <div className="row">
                                    <div className="col-6">
                                        <label>Empty Start Date:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobExportDetail.emptyStartDate',
                                            )
                                                ? moment(selectedJob
                                                    .jobExportDetail
                                                    .emptyStartDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label>Full Start Date:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobExportDetail.fullStartDate',
                                            )
                                                ? moment(selectedJob
                                                    .jobExportDetail
                                                    .fullStartDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label>Cut off Date:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobExportDetail.cutOffDate',
                                            )
                                                ? moment(selectedJob
                                                    .jobExportDetail
                                                    .cutOffDate)
                                                    .format('MM/DD/YYYY')
                                                : null}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="row container-field">
                                <div className="col-12">
                                    <label>Containers</label>
                                    {selectedJob.container.length && (
                                        <ul className="container-table">
                                            {_.map(
                                                selectedJob.container,
                                                (item, index) => (
                                                    <li
                                                        key={`${
                                                            item.id
                                                        }${index}`}
                                                    >
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        Type
                                                                </h4>
                                                            )}
                                                            <div className="detail">
                                                                {item.type}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>#</h4>
                                                            )}
                                                            <div className="detail">
                                                                {
                                                                    item.equipmentNo
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        Weight
                                                                </h4>
                                                            )}

                                                            <div className="detail">
                                                                {
                                                                    item.grossWeight
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        description
                                                                </h4>
                                                            )}
                                                            <div className="detail">
                                                                {
                                                                    item.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            {selectedJob.type === 'Import' && (
                                <div className="row">
                                    <div className="col-6">
                                        <label>Customs Status:</label>
                                        <div>
                                            {_.get(
                                                selectedJob,
                                                'jobImportDetail.customs',
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <label>
                                                Terminal Released Date:
                                        </label>
                                        <div>{selectedJob.released}</div>
                                    </div>
                                </div>
                            )}
                        </section>
                    )}
                    {selectedJob &&
                        selectedJob.type === 'Cross Town' && (
                        <section className="job-detail-view-main-area">
                            <div className="row">
                                <div className="col-6">
                                    <label>Client Reference #:</label>
                                    <div>{selectedJob.clientRefNo}</div>
                                </div>
                                <div className="col-6">
                                    <label>Shipper:</label>
                                    <LocationHelpView
                                        location={selectedJob.shipper}
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Consignee:</label>
                                    <LocationHelpView
                                        location={selectedJob.consignee}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-12 remark">
                                    <label>Instructions:</label>
                                    <p>{selectedJob.remarks}</p>
                                </div>
                            </div>

                            <div className="row container-field">
                                <div className="col-12">
                                    <label>Containers</label>
                                    {selectedJob.container.length && (
                                        <ul className="container-table">
                                            {_.map(
                                                selectedJob.container,
                                                (item, index) => (
                                                    <li
                                                        key={`${
                                                            item.id
                                                        }${index}`}
                                                    >
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        Type
                                                                </h4>
                                                            )}
                                                            <div className="detail">
                                                                {item.type}
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        equipmentNo
                                                                </h4>
                                                            )}
                                                            <div className="detail">
                                                                {
                                                                    item.equipmentNo
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        grossWeight
                                                                </h4>
                                                            )}

                                                            <div className="detail">
                                                                {
                                                                    item.grossWeight
                                                                }
                                                            </div>
                                                        </div>
                                                        <div>
                                                            {index ===
                                                                    0 && (
                                                                <h4>
                                                                        description
                                                                </h4>
                                                            )}
                                                            <div className="detail">
                                                                {
                                                                    item.description
                                                                }
                                                            </div>
                                                        </div>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </section>
                    )}
                    {/* <footer className="btn-close-actions">
                        <div className="job-detail-view-footer">
                            <Button
                                flat
                                label="close"
                                onClick={closeJobView}
                                className="rounded-button default"
                            />
                        </div>
                    </footer> */}
                </DialogContainer>
            )
        );
    }
}

const mapStateToProps = state => {
    return {};
};
const mapDispatchToProps = dispatch => {
    return {
        closeJobView: () => {
            dispatch({ type: 'CLOSE_JOB_DETAIL_VIEW' });
        },
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobViewDialog);
