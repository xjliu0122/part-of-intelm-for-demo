import React, { Component } from 'react';
import { connect } from 'react-redux';
//React MD
import { Button, DialogContainer } from 'react-md';
import _ from 'lodash';

import moment from 'moment';

import LocationHelpView from 'components/LocationTooltip/locationTooltip';

import './styles.scss';

// *********************this view is not used as of now.  but keeping it in case of future use **************

class QuoteViewDialog extends Component {
    render() {
        const { closeWindow, quote } = this.props;

        return (
            quote &&
            !_.isEmpty(quote) && (
                <DialogContainer
                    id="quoteDetailDialogue"
                    visible
                    aria-labelledby="view detail"
                    focusOnMount={false}
                    modal
                >
                    <header className="modal-header">
                        <h2 className="montserrat-bold">quote Details</h2>
                        <Button icon primary onClick={closeWindow}>
                            close
                        </Button>
                    </header>
                    <section className="job-detail-view-main-area">
                        <div className="row">
                            <div className="col-6">
                                <label>Type:</label>
                                <div>{quote.type}</div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>Pickup from location:</label>
                                <LocationHelpView
                                    location={quote.pickupFromLocation}
                                />
                            </div>
                            <div className="col-6">
                                <label>Pickup Date:</label>
                                <div>
                                    {quote.pickupDate
                                        ? moment(quote.pickupDate)
                                            .format('MM/DD/YYYY')
                                        : null}
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>Delivery location:</label>
                                <LocationHelpView
                                    location={quote.deliverToLocation}
                                />
                            </div>
                            <div className="col-6">
                                <label>Delivery Date:</label>
                                <div>
                                    {quote.deliveryDate
                                        ? moment(quote.deliveryDate)
                                            .format('MM/DD/YYYY')
                                        : null}
                                </div>
                            </div>
                        </div>
                        <div className="row container-field">
                            <div className="col-12">
                                <label>Containers</label>
                                {quote.container.length && (
                                    <ul className="container-table">
                                        {_.map(
                                            quote.container,
                                            (item, index) => (
                                                <li key={`${item.id}${index}`}>
                                                    <div>
                                                        {index === 0 && (
                                                            <h4>Type</h4>
                                                        )}
                                                        <div className="detail">
                                                            {item.type}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {index === 0 && (
                                                            <h4>Dimensions</h4>
                                                        )}
                                                        <div className="dimension-detail">
                                                            L:{item.length}, W:{
                                                                item.width
                                                            }, H:{item.height}{' '}
                                                            {item.unit}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {index === 0 && (
                                                            <h4>#</h4>
                                                        )}
                                                        <div className="detail">
                                                            {item.equipmentNo}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {index === 0 && (
                                                            <h4>
                                                                Cargo Gross
                                                                Weight
                                                            </h4>
                                                        )}

                                                        <div className="detail">
                                                            {item.grossWeight}
                                                        </div>
                                                    </div>
                                                    <div>
                                                        {index === 0 && (
                                                            <h4>
                                                                Cargo/Commodity
                                                                Description
                                                            </h4>
                                                        )}
                                                        <p>
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </li>
                                            ),
                                        )}
                                    </ul>
                                )}
                            </div>
                        </div>
                        <div className="row option-field">
                            <div className="col-12">
                                <label>Options:</label>
                                <div>{quote.loadingOptions}</div>
                                {quote.hazmat && (
                                    <div className="job-options">hazmat</div>
                                )}
                                {quote.oversize && (
                                    <div className="job-options">oversize</div>
                                )}
                                {quote.overweight && (
                                    <div className="job-options">
                                        overweight
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-6">
                                <label>remarks:</label>
                                <div>{quote.remarks}</div>
                            </div>
                            <div className="col-6">
                                <label>notes:</label>
                                <div>{quote.notes}</div>
                            </div>
                        </div>
                    </section>
                </DialogContainer>
            )
        );
    }
}

export default QuoteViewDialog;
