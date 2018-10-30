import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import Idle from 'react-idle';
import _ from 'lodash';
import AppHeader from 'components/AppHeader';
import Spinner from 'components/Spinner';
import { browserHistory } from 'react-router';
import UserProfileEntity from 'entities/UserProfile/action';
import ManagedLocationEntity from 'entities/ManagedLocation/action';
import CompanyEntity from 'entities/Company/action';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import localStorageHelper from 'clientUtils/localStorageHelper';
import toastMessageHelper from 'clientUtils/toastMessageHelper';
import JobViewDetail from 'components/Jobs/jobDetailView';
import HeartBeat from './heartbeat';
import './global.scss';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: '#3f51b5',
        },
    },
    overrides: {
        MuiTableCell: {
            head: {
                color: '#424242',
                fontWeight: 'bold',
                fontSize: '0.9rem',
            },
            body: {
                fontSize: '14px',
            },
        },
        MuiTable: {
            root: {
                fontFamily: 'Lato',
                minWidth: '800px !important',
            },
        },
        MuiTab: {
            label: {
                fontSize: '1rem',
            },
        },
        MuiMenuItem: {
            root: {
                display: 'flex',
                flexDirection: 'column', // margin-bottom: 8px;
                height: '36px',
            },
        },
    },
});
class MainAppLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabs: [],
        };
        if (localStorageHelper.getToken() === null) {
            browserHistory.push('/login');
            return;
        }
        this.props.getUserProfile();
        this.props.getManagedLocations();
        //this.props.getAllTCs();
        this.props.getAllBCO();
    }
    componentWillMount = () => {};
    componentWillReceiveProps(nextProps) {
        const userrole = _.get(nextProps.userProfile, 'role'),
            active = _.get(nextProps.userProfile, 'active'),
            companyActive = _.get(nextProps.userProfile, 'company.active');
        if (userrole === 'tc') {
            toastMessageHelper.mapApiError('If you are one of our registered drivers, please use mobile app to login');
            browserHistory.push('/login');
        }
        if (userrole === 'bco' && !active) {
            toastMessageHelper.mapApiError('Your account is not active. Please contact us.');
            browserHistory.push('/login');
        }
        if (userrole === 'bco' && !companyActive) {
            toastMessageHelper.mapApiError('Your company account is not active. Please contact us.');
            browserHistory.push('/login');
        }
    }

    render() {
        const { jobDetail, messages } = this.props;

        return (
            <MuiThemeProvider theme={theme}>
                <div className="main-app-layout">
                    <Spinner />
                    <AppHeader
                        userTabs={this.state.tabs}
                        location={this.props.location}
                    />
                    <div className="main-app-container">
                        {this.props.children}
                    </div>
                    <HeartBeat />
                    <Idle
                        timeout={3500000}
                        onChange={({ idle }) => {
                            if (idle) {
                                browserHistory.push('/login');
                            }
                        }}
                    />
                    {jobDetail && <JobViewDetail job={jobDetail} />}
                </div>
            </MuiThemeProvider>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
        return {
            userProfile: state.userProfileReducer.profile,
            jobDetail: state.jobDetailViewReducer,
        };
    },
    mapDispatchToProps = dispatch => {
        return {
            getAllBCO: () => dispatch(CompanyEntity.ui.list()),
            getUserProfile: () => {
                dispatch(UserProfileEntity.ui.get());
            },
            getManagedLocations: () => {
                dispatch(ManagedLocationEntity.ui.list());
            },
        };
    };

export default connect(mapStateToProps, mapDispatchToProps)(MainAppLayout);
