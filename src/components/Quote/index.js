import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import QuoteEntity from 'entities/Quote/action';
import moment from 'moment';

//React MD
import PaperMui from '@material-ui/core/Paper';
import { Paper, Button, SelectField, Autocomplete } from 'react-md';
import LocationAutocomplete from 'components/Form/locationAutoComplete/index';
import AddJobDialog from 'components/Jobs/edit';
import Config from 'components/config';
// component
import Edit from './addOrEditQuote';
import QuoteListTable from './tableLQuoteList';
import QuoteDetail from './quoteDetail';
import './styles.scss';

class QuoteView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEditDialogOpen: false,
            isAddJobDialogOpen: false,
            editingQuote: null,
            customFilterOpen: false,
            customFilter: {},
            quoteDetail: null,
            openViewQuoteDialog: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.toggleCustomFilterOpen = this.toggleCustomFilterOpen.bind(this);
        this.searchWithCustomFilter = this.searchWithCustomFilter.bind(this);
        this.OpenEditDialog = this.OpenEditDialog.bind(this);
        this.CloseEditDialog = this.CloseEditDialog.bind(this);

        this.openViewDialog = this.openViewDialog.bind(this);
        this.closeViewDialog = this.closeViewDialog.bind(this);
        this.closeAddJobDialog = this.closeAddJobDialog.bind(this);
        this.openAddJobDialog = this.openAddJobDialog.bind(this);
    }
    componentWillMount() {
        this.searchWithCustomFilter();
        this.props.clearClientLocations();
    }
    OpenEditDialog(quote = null) {
        this.setState({
            editingQuote: quote,
            isEditDialogOpen: true,
        });
    }
    openViewDialog(quote = null) {
        this.setState({
            quoteDetail: quote,
            openViewQuoteDialog: true,
        });
    }
    CloseEditDialog() {
        this.setState({
            isEditDialogOpen: false,
            editingQuote: null,
        });
    }
    closeViewDialog() {
        this.setState({
            quoteDetail: null,
            openViewQuoteDialog: false,
        });
    }
    handleChange(value, type) {
        this.setState({
            [type]: value,
        });
    }

    toggleCustomFilterOpen() {
        this.setState({
            customFilterOpen: !this.state.customFilterOpen,
        });
    }
    getRemoteData(params) {
        this.searchWithCustomFilter(params);
    }
    searchWithCustomFilter(oDataParams = {}) {
        const cust = this.state.customFilter;
        this.props.getQuotesWithFilter({
            ...cust,
            ...oDataParams,
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
    closeAddJobDialog() {
        this.setState({
            isAddJobDialogOpen: false,
            formType: null,
            fromQuote: null,
        });
    }
    openAddJobDialog(quote) {
        this.setState({
            isAddJobDialogOpen: true,
            formType: quote.type,
            fromQuote: quote,
        });
    }
    render() {
        const { allBCO } = this.props,
            {
                CloseEditDialog,
                OpenEditDialog,
                searchWithCustomFilter,
                openViewDialog,
                closeViewDialog,
                closeAddJobDialog,
                openAddJobDialog,
                toggleCustomFilterOpen,
            } = this,
            { role } = this.props.user,
            {
                customFilterOpen,
                customFilter,
                isEditDialogOpen,
                editingQuote,
                quoteDetail,
                openViewQuoteDialog,
                isAddJobDialogOpen,
                formType,
                fromQuote,
            } = this.state;
        return (
            <div className="quote-view-container">
                <Paper className="top-level-card" zDepth={0}>
                    <div className="header-row">
                        <Button
                            icon
                            className="job-filter-btn"
                            primary
                            iconClassName="fa fa-filter"
                            onClick={toggleCustomFilterOpen}
                        />
                        {role === 'bco' && (
                            <div className="float-right">
                                <Button
                                    flat
                                    primary
                                    className="request-quote-btn"
                                    iconClassName="fa fa-plus"
                                    onClick={OpenEditDialog}
                                >
                                    Request quote
                                </Button>
                            </div>
                        )}
                    </div>
                    {customFilterOpen && (
                        <PaperMui className="custom-filter-container">
                            <div className="row">
                                <div className="col-2">
                                    <SelectField
                                        fullWidth
                                        id="select-job-type"
                                        placeholder="Quote Type"
                                        menuItems={
                                            Config.QuoteTypeSelectionCriteria
                                        }
                                        value={customFilter.quoteType}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    quoteType: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        position={SelectField.Positions.BELOW}
                                    />
                                </div>
                                <div className="col-2">
                                    <SelectField
                                        fullWidth
                                        id="select-job-status"
                                        placeholder="Status"
                                        menuItems={
                                            Config.QuoteStatusSelectionCriteria
                                        }
                                        value={customFilter.status}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    status: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        position={SelectField.Positions.BELOW}
                                    />
                                </div>
                                <div className="col-2">
                                    <SelectField
                                        fullWidth
                                        id="select-cont-type"
                                        placeholder="Container Type"
                                        itemLabel="description"
                                        itemValue="code"
                                        menuItems={[
                                            { code: '', description: 'All' },
                                            ...Config.ContainerTypes,
                                        ]}
                                        value={customFilter.containerType}
                                        onChange={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    containerType: value,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        position={SelectField.Positions.BELOW}
                                    />
                                </div>
                            </div>

                            <div className="row">
                                {role === 'dispatcher' && (
                                    <div className="col-2">
                                        <Autocomplete
                                            id="idFilterClient"
                                            label="Client"
                                            placeholder="Search..."
                                            data={allBCO}
                                            dataLabel="name"
                                            dataValue="id"
                                            onChange={() =>
                                                this.handleChange(
                                                    {
                                                        ...customFilter,
                                                        clientId: null,
                                                    },
                                                    'customFilter',
                                                )
                                            }
                                            onAutocomplete={value =>
                                                this.handleChange(
                                                    {
                                                        ...customFilter,
                                                        clientId: value,
                                                    },
                                                    'customFilter',
                                                )
                                            }
                                        />
                                    </div>
                                )}
                                <div className="col-4">
                                    <LocationAutocomplete
                                        label="Port"
                                        port
                                        placeholder="Select or Search..."
                                        handleSelected={value =>
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    port: value.id,
                                                },
                                                'customFilter',
                                            )
                                        }
                                        handleSearchTextChange={() => {
                                            this.handleChange(
                                                {
                                                    ...customFilter,
                                                    port: null,
                                                },
                                                'customFilter',
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-12">
                                    <Button
                                        raised
                                        primary
                                        className="search-button"
                                        onClick={() => {
                                            searchWithCustomFilter();
                                            toggleCustomFilterOpen();
                                        }}
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
                    {isEditDialogOpen && (
                        <Edit
                            closeWindow={CloseEditDialog}
                            //role={this.props.userProfile.role}
                            quote={editingQuote}
                        />
                    )}
                    {openViewQuoteDialog && (
                        <QuoteDetail
                            closeWindow={closeViewDialog}
                            quote={quoteDetail}
                        />
                    )}
                    {isAddJobDialogOpen && (
                        <AddJobDialog
                            closeWindow={closeAddJobDialog}
                            formType={formType}
                            role={role}
                            quote={fromQuote}
                        />
                    )}
                    <QuoteListTable
                        showEditDialog={row => OpenEditDialog(row)}
                        showViewDialog={row => openViewDialog(row)}
                        openAddJobDialog={row => openAddJobDialog(row)}
                    />
                </Paper>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            user: state.userProfileReducer.profile,
            allBCO: state.companyReducer.bco,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getQuotesWithFilter: filter => {
                dispatch(QuoteEntity.ui.list(filter));
            },
            clearClientLocations: () => {
                dispatch({ type: 'CLEAR_CLIENT_LOCATIONS' });
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(QuoteView);
