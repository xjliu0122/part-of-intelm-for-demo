import React, { Component } from 'react';
import { connect } from 'react-redux';
//React MD
import { Button, DialogContainer } from 'react-md';
import _ from 'lodash';
import moment from 'moment';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';
import './loadDetail.scss';

class LoadViewDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedLoad: null,
            quote: props.row,
        };
        if (this.props.container) {
            this.state = { selectedLoad: { ...this.props.container } };
        }
    }

    render() {
        const { selectedLoad, quote } = this.state,
            { closeView, role } = this.props;

        return (
            selectedLoad && (
                <DialogContainer
                    id="loadQuoteViewDetailDialogue"
                    visible
                    aria-labelledby="view detail"
                    focusOnMount={false}
                    modal
                >
                    <header className="modal-header">
                        <h2 className="montserrat-bold">
                            Container {selectedLoad.equipmentNo}
                        </h2>
                        <Button icon primary onClick={closeView}>
                            close
                        </Button>
                    </header>
                    {role === 'dispatcher' && (
                        <section className="job-summary-area" />
                    )}
                    <section className="load-detail-view-main-area">
                        <div className="row">
                            <div className="col-6">
                                <label>Type</label>
                                <div>{selectedLoad.type}</div>
                            </div>

                            <div className="col-6">
                                <label>Dimension:</label>
                                <div className="dimension-fields">
                                    L:{' '}
                                    {` ${_.get(selectedLoad, 'length') || ''}`}
                                </div>
                                <div className="dimension-fields">
                                    W:{' '}
                                    {` ${_.get(selectedLoad, 'width') || ''}`}
                                </div>
                                <div className="dimension-fields">
                                    H:{' '}
                                    {` ${_.get(selectedLoad, 'height') || ''}`}
                                </div>
                                <div className="dimension-fields">
                                    {` ${_.get(selectedLoad, 'unit') || ''}`}
                                </div>
                            </div>

                            <div className="col-6">
                                <label>Gross weight: </label>
                                <div>{_.get(selectedLoad, 'grossWeight')}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-12">
                                <label>Description:</label>
                                {selectedLoad.description}
                            </div>
                        </div>
                        {_.get(quote, 'type') !== 'Import' && (
                            <div className="row">
                                <div className="col-6">
                                    <label>Pickup from:</label>
                                    <LocationHelpView
                                        location={
                                            selectedLoad.pickupFromLocation
                                        }
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Pickup date:</label>
                                    {_.get(selectedLoad, 'pickupDate')
                                        ? moment(selectedLoad.pickupDate)
                                            .format('MM/DD/YYYY')
                                        : null}
                                </div>
                            </div>
                        )}
                        {_.get(quote, 'type') !== 'Export' && (
                            <div className="row">
                                <div className="col-6">
                                    <label>Deliver to:</label>
                                    <LocationHelpView
                                        location={
                                            selectedLoad.deliverToLocation
                                        }
                                    />
                                </div>
                                <div className="col-6">
                                    <label>Delivery date:</label>
                                    {_.get(selectedLoad, 'deliveryDate')
                                        ? moment(selectedLoad.deliveryDate)
                                            .format('MM/DD/YYYY')
                                        : null}
                                </div>
                            </div>
                        )}
                        <div className="row option-field">
                            <div className="col-12">
                                <label>Options:</label>
                                <div>{selectedLoad.loadingOptions}</div>
                                {selectedLoad.oversize && (
                                    <div className="job-options">oversize</div>
                                )}
                                {selectedLoad.overweight && (
                                    <div className="job-options">
                                        overweight
                                    </div>
                                )}
                                {selectedLoad.hazmat && (
                                    <div className="job-options">hazmat</div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>LFD Return Date:</label>
                                {_.get(selectedLoad, 'lfdEmptyReturnDate')
                                    ? moment(selectedLoad.lfdEmptyReturnDate)
                                        .format('MM/DD/YYYY')
                                    : null}
                            </div>
                            <div className="col-6">
                                <label>Empty Ready Date:</label>
                                {_.get(selectedLoad, 'emptyReadyDate')
                                    ? moment(selectedLoad.emptyReadyDate)
                                        .format('MM/DD/YYYY')
                                    : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>Empty Request Date:</label>
                                {_.get(selectedLoad, 'emptyRequestDate')
                                    ? moment(selectedLoad.emptyRequestDate)
                                        .format('MM/DD/YYYY')
                                    : null}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>Quoted Amount:</label>
                                <div>
                                    {_.get(selectedLoad, 'quotedAmt')
                                        ? `$${_.get(selectedLoad, 'quotedAmt')}`
                                        : ''}
                                </div>
                            </div>
                        </div>

                        {role === 'dispatcher' && (
                            <div className="row">
                                <div className="col-6">
                                    <label>Chassis Type: </label>
                                    <div>
                                        {_.get(selectedLoad, 'chassisType')}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label>Chassis No: </label>
                                    <div>
                                        {_.get(selectedLoad, 'chassisNo')}
                                    </div>
                                </div>
                                <div className="col-6">
                                    <label>Seal: </label>
                                    <div>{_.get(selectedLoad, 'seal')}</div>
                                </div>
                            </div>
                        )}
                    </section>
                </DialogContainer>
            )
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        role: state.userProfileReducer.profile.role,
    };
};
const mapDispatchToProps = dispatch => {
    return {};
};
export default connect(mapStateToProps, mapDispatchToProps)(LoadViewDialog);
