import React, { Component } from 'react';
//React MD
import { Button, DialogContainer } from 'react-md';
import PhoneNumberUtil from '../../SharedService/phoneNo';

import './styles.scss';

class CompanyDetailsDialog extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentWillMount = () => {};

    render() {
        const { closeView, company } = this.props;

        return (
            <DialogContainer
                id="companyDetailDialogue"
                visible
                aria-labelledby="view detail"
                focusOnMount={false}
                modal
            >
                <header className="modal-header">
                    <h2 className="montserrat-bold">company details</h2>
                    <Button icon primary onClick={closeView}>
                        close
                    </Button>
                </header>
                <section className="company-details-container">
                    <div className="row">
                        <div className="col-6">
                            <label>company name:</label>
                            <div>{company.name}</div>
                        </div>
                        <div className="col-6">
                            <label>business category:</label>
                            <div>{company.type}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>Business Entity Type:</label>
                            <div>{company.businessType}</div>
                        </div>

                        <div className="col-6">
                            <label>Tax ID:</label>
                            <div>{company.taxId}</div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>address:</label>
                            <div>{company.address}</div>
                        </div>
                        <div className="col-6">
                            <label>Phone Number:</label>
                            <div>
                                {PhoneNumberUtil.formatPhoneNumber(company.phone)}
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-6">
                            <label>email:</label>
                            <div>{company.email}</div>
                        </div>
                        <div className="col-6">
                            <label>SCAC#:</label>
                            <div>{company.SCAC}</div>
                        </div>
                    </div>
                    {(company.type === 'Owner Operator' ||
                        company.type === 'Trucking Company') && (
                        <div>
                            <div className="row">
                                <div className="col-6">
                                    <label>DOT#:</label>
                                    <div>{company.dot}</div>
                                </div>
                                <div className="col-6">
                                    <label>MC#:</label>
                                    <div>{company.mc}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label>Permits:</label>
                                    {company.haz && <div>hazmat</div>}
                                    {company.oversize && <div>oversize</div>}
                                    {company.overweight && (
                                        <div>overweight</div>
                                    )}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label>notes:</label>
                                    <div>{company.notes}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label>States Served:</label>
                                    <div>{company.stateServed}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label>Areas of Operation:</label>
                                    <div>{company.operationArea}</div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <label>services provided:</label>
                                    {company.ocean && (
                                        <div>Ocean Port Drayage</div>
                                    )}
                                    {company.rail && (
                                        <div>Rail Ramp Drayage</div>
                                    )}
                                    {company.iso && <div>ISO Tank Drayage</div>}
                                    {company.oog && (
                                        <div>Out Of Gage (OOG, Oversize)</div>
                                    )}
                                    {company.hazardous && (
                                        <div>Hazardous Material</div>
                                    )}
                                    {company.customs && (
                                        <div>Customs Bonded</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </section>
                <footer className="btn-close-actions">
                    <div className="job-detail-view-footer">
                        <Button
                            flat
                            label="close"
                            onClick={closeView}
                            className="rounded-button default"
                        />
                    </div>
                </footer>
            </DialogContainer>
        );
    }
}

export default CompanyDetailsDialog;
