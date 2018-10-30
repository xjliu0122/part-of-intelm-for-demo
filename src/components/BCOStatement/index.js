import React, { Component } from 'react';
import ReportTable from './tableList';

import { connect } from 'react-redux';

import moment from 'moment';
import _ from 'lodash';
import ReportEntity from 'entities/Report/action';
//React MD
import { Paper, Button, FontIcon, DatePicker } from 'react-md';
import PaperMui from '@material-ui/core/Paper';
import './index.scss';

class ReportView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            customFilterOpen: false,
            customFilter: {
                fromDate: moment()
                    .startOf('day')
                    .subtract(30, 'days')
                    .toDate(),
                toDate: moment()
                    .startOf('day')
                    .toDate(),
            },
        };
        this.toggleCustomFilterOpen = this.toggleCustomFilterOpen.bind(this);
        this.openPDFView = this.openPDFView.bind(this);
        this.searchWithCustomFilter = this.searchWithCustomFilter.bind(this);
        this.clearFilterDateValue = this.clearFilterDateValue.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    componentWillMount() {
        if (this.props.profile) {
            this.searchWithCustomFilter();
        }
    }
    componentWillReceiveProps = nextProps => {
        if (
            nextProps.profile &&
            !_.isEqual(this.props.profile, nextProps.profile)
        ) {
            this.searchWithCustomFilter(_.get(nextProps, 'profile.company.qboCompanyId'));
        }
    };

    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }
    formatDate(value) {
        if (value) {
            return moment(value)
                .format('MM/DD/YYYY');
        }
        return null;
    }
    clearFilterDateValue(e, name) {
        e.stopPropagation();
        const newFilter = { ...this.state.customFilter };
        newFilter[name] = null;
        this.setState({
            customFilter: newFilter,
        });
    }
    getUtcDayStartTimeStampFromDate(date) {
        if (!date) return null;
        return moment.utc(moment(date)
            .startOf('day'))
            .format();
    }
    getUtcDayEndTimeStampFromDate(date) {
        if (!date) return null;
        return moment.utc(moment(date)
            .endOf('day'))
            .format();
    }
    toggleCustomFilterOpen() {
        this.setState({
            customFilterOpen: !this.state.customFilterOpen,
        });
    }
    openPDFView(pdfViewInvoiceId) {
        this.props.getInvoicePDF(pdfViewInvoiceId);
    }
    searchWithCustomFilter(qboCompId) {
        let { fromDate, toDate } = this.state.customFilter;
        if (fromDate) {
            fromDate = moment(fromDate)
                .format('YYYY-MM-DD');
        } else {
            fromDate = '2000-01-01';
        }
        if (toDate) {
            toDate = moment(toDate)
                .format('YYYY-MM-DD');
        } else {
            toDate = '2099-12-31';
        }

        this.props.getBCOStatementReport({
            qboCompId:
                qboCompId || _.get(this.props, 'profile.company.qboCompanyId'),
            fromDate,
            toDate,
        });
    }
    render() {
        const {
                toggleCustomFilterOpen,
                searchWithCustomFilter,
                openPDFView,
            } = this,
            { customFilterOpen, customFilter } = this.state;
        return (
            <div className="bco-statement-container">
                <Paper className="top-level-card" zDepth={0}>
                    <div className="header-row">
                        <Button
                            icon
                            className="filter-btn"
                            primary
                            iconClassName="fa fa-filter"
                            onClick={toggleCustomFilterOpen}
                        />
                    </div>
                    {customFilterOpen && (
                        <PaperMui className="custom-filter-container">
                            <div className="row">
                                <div className="col-2">
                                    <DatePicker
                                        label="Invoice Date From"
                                        autoOk
                                        inline
                                        readonly={false}
                                        value={customFilter.fromDate}
                                        maxDate={moment(customFilter.toDate || '2050-12-31')
                                            .toDate()}
                                        rightIcon={
                                            <FontIcon
                                                onClick={e =>
                                                    this.clearFilterDateValue(
                                                        e,
                                                        'fromDate',
                                                    )
                                                }
                                            >
                                                close
                                            </FontIcon>
                                        }
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    fromDate: moment(value)
                                                        .toDate(),
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                                <div className="col-2">
                                    <DatePicker
                                        label="To"
                                        autoOk
                                        inline
                                        fullWidth={false}
                                        icon={null}
                                        readonly={false}
                                        value={customFilter.toDate}
                                        minDate={moment(customFilter.fromDate ||
                                                '2000-01-01')
                                            .toDate()}
                                        rightIcon={
                                            <FontIcon
                                                onClick={e =>
                                                    this.clearFilterDateValue(
                                                        e,
                                                        'toDate',
                                                    )
                                                }
                                            >
                                                close
                                            </FontIcon>
                                        }
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    toDate: moment(value)
                                                        .toDate(),
                                                },
                                                'customFilter',
                                            )
                                        }
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Button
                                        raised
                                        primary
                                        className="search-button"
                                        onClick={() => searchWithCustomFilter()}
                                    >
                                        search
                                    </Button>

                                    <Button
                                        raised
                                        secondary
                                        onClick={toggleCustomFilterOpen}
                                    >
                                        close
                                    </Button>
                                </div>
                            </div>
                        </PaperMui>
                    )}
                    <div className="row list-table-container">
                        <div className="col-12">
                            <ReportTable openPDFView={openPDFView} />
                        </div>
                    </div>
                </Paper>
            </div>
        );
    }
}
const mapStateToProps = state => {
    return {
        profile: state.userProfileReducer.profile,
        pdf: state.reportReducer.invoicePdfData,
    };
};
const mapDispatchToProps = dispatch => {
    return {
        getBCOStatementReport: params => {
            dispatch(ReportEntity.ui.getBCOStatement(params));
        },
        getInvoicePDF: id => {
            dispatch(ReportEntity.ui.getInvoicePDF(id));
            ReportEntity.after.getInvoicePDF = params => {
                const URL = window.URL || window.webkitURL;
                let imageUrl;

                if (URL) {
                    imageUrl = URL.createObjectURL(dataURItoBlob(`data:application/pdf;base64, ${params.response}`));
                }

                const win = window.open(imageUrl, '_blank');
                win.focus();
            };
        },
    };
};
function dataURItoBlob(dataURI) {
    const mime = dataURI
        .split(',')[0]
        .split(':')[1]
        .split(';')[0];
    const binary = atob(dataURI.split(',')[1]);
    const array = [];
    for (let i = 0; i < binary.length; i++) {
        array.push(binary.charCodeAt(i));
    }
    return new Blob([new Uint8Array(array)], { type: mime });
}
export default connect(mapStateToProps, mapDispatchToProps)(ReportView);
