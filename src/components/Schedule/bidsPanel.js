import * as React from 'react';
import { connect } from 'react-redux';

import _ from 'lodash';
import {
    Grid,
    Table,
    TableHeaderRow,
} from '@devexpress/dx-react-grid-material-ui';
import Paper from '@material-ui/core/Paper';
import Config from 'components/config';
import DoneIcon from '@material-ui/icons/Done';
import CancelIcon from '@material-ui/icons/Clear';
import SigIcon from '@material-ui/icons/Assignment';

import IconButton from '@material-ui/core/IconButton';
import CompanyTooltip from 'components/CompanyTooltip/companyTooltip';

import tripUtil from 'components/SharedService/trip';
import TripEntity from 'entities/Trip/action';
import LocationHelpView from 'components/LocationTooltip/locationTooltip';
import SignatureView from 'components/Schedule/signatureModal';

const Cell = props => {
    return <Table.Cell {...props} />;
};
const getRowId = row => row.id;

class BidsPanel extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { name: 'company', title: 'Company' },
                { name: 'fixed', title: 'Fixed' },
                { name: 'requestedByIM', title: 'Requested' },
                { name: 'status', title: 'Status' },
                { name: 'amount', title: 'Amount' },
                { name: 'updatedAt', title: 'Last updates' },
                { name: 'actions', title: ' ' },
            ],
            tableColumnExtensions: [
                { columnName: 'company', width: '200', align: 'left' },
                { columnName: 'fixed', width: '100', align: 'left' },
                { columnName: 'requestedByIM', width: '80', align: 'left' },
                { columnName: 'status', width: '100', align: 'left' },
                { columnName: 'amount', width: '100', align: 'left' },
                { columnName: 'updatedAt', align: 'left' },
                { columnName: 'actions', width: '200', align: 'left' },
            ],
            rows: props.row.bidRequest || [],
            trip: props.row,
            showSignatureModal: false,
            showSignatureId: null,
            showSignatureIdPdfDocLink: null,
        };
        this.getCellValue = this.getCellValue.bind(this);
        this.toggleSignatureModal = this.toggleSignatureModal.bind(this);
    }
    componentWillReceiveProps = nextProps => {
        if (nextProps.row !== this.props.row) {
            this.setState({
                rows: nextProps.row.bidRequest,
                trip: nextProps.row,
            });
        }
    };
    getCellValue = (row, columnName) => {
        const { trip } = this.state;
        switch (columnName) {
            case 'company':
                return <CompanyTooltip company={_.get(row, 'company')} />;
            case 'status':
                return _.get(row, 'status');
            case 'amount':
                return _.get(row, 'amount');
            case 'requestedByIM':
                return _.get(row, 'requestedByIM') ? <DoneIcon /> : '';
            case 'fixed':
                return _.get(row, 'fixed') ? <DoneIcon /> : '';
            case 'updatedAt':
                return tripUtil.getFormattedStringFromUTCDateTime(_.get(row, 'updatedAt'));
            case 'actions':
                return (
                    <div className="float-right">
                        {!_.get(trip, 'assigneeId') &&
                            (row.status === 'Bid' && (
                                <IconButton
                                    onClick={() => {
                                        this.acceptBid(row);
                                    }}
                                    title="Choose"
                                >
                                    <DoneIcon />
                                </IconButton>
                            ))}
                        {_.get(trip, 'assigneeId') &&
                            _.get(trip, 'assigneeId') ===
                                _.get(row, 'companyId') && (
                            <IconButton
                                onClick={() => {
                                    this.cancelChosenBid(row);
                                }}
                                title="Cancel"
                                disabled={
                                    Config.noCancelAssginment.indexOf(_.get(trip, 'status')) !== -1
                                }
                            >
                                <CancelIcon />
                            </IconButton>
                        )}
                    </div>
                );
            default:
                return _.get(row, columnName);
        }
    };
    acceptBid(row) {
        const { tripId } = row,
            bidId = row.id;
        this.props.assignToBid({ tripId, bidId });
    }
    cancelChosenBid(row) {
        const { tripId } = row,
            bidId = null;
        this.props.assignToBid({ tripId, bidId });
    }
    toggleSignatureModal(id = null, pdfDocLink) {
        this.setState({
            showSignatureModal: !this.state.showSignatureModal,
            showSignatureId: id,
            showSignatureIdPdfDocLink: pdfDocLink,
        });
    }
    render() {
        const {
                rows,
                columns,
                tableColumnExtensions,
                showSignatureModal,
                showSignatureId,
                showSignatureIdPdfDocLink,
            } = this.state,
            { getCellValue, toggleSignatureModal } = this,
            { row } = this.props;

        return (
            <div className="bids-details-Panel">
                <div className="trip-summary-field">
                    <div className="prefix">Summary:</div>
                    {row.stop.map((s, index) => {
                        return (
                            <div className="stop-item">
                                <div className="stop-index">
                                    {`${index + 1}:`}
                                </div>
                                <div className="stop-name">
                                    <LocationHelpView
                                        location={s.stopLocation}
                                    />
                                </div>
                                <div className="stop-time">
                                    @{_.join(
                                        _.compact([
                                            tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.plannedDateTime),
                                            tripUtil.getFormattedTimeOnlyFromUTCDateTime(s.actualTime),
                                        ]),
                                        ' / ',
                                    )}
                                </div>
                                {s.status === 'Completed' && (
                                    <div className="stop-signature">
                                        <SigIcon
                                            onClick={() => {
                                                this.toggleSignatureModal(
                                                    s.id,
                                                    s.pdfDocLink,
                                                );
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {_.size(rows) > 0 && (
                    <div>
                        <div className="panel-tile ">Bids:</div>

                        <Paper elevation={0} className="bids-details-container">
                            <Grid
                                rows={rows}
                                columns={columns}
                                getRowId={getRowId}
                                getCellValue={getCellValue}
                            >
                                <Table
                                    columnExtensions={tableColumnExtensions}
                                    cellComponent={Cell}
                                />

                                <TableHeaderRow />
                            </Grid>
                        </Paper>
                    </div>
                )}
                {showSignatureModal && (
                    <SignatureView
                        closeWindow={toggleSignatureModal}
                        id={showSignatureId}
                        link={showSignatureIdPdfDocLink}
                    />
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {};
    },
    mapDispatchToProps = dispatch => {
        return {
            assignToBid: params => {
                dispatch(TripEntity.ui.assign(params));
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(BidsPanel);
