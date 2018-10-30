import * as React from 'react';
import { connect } from 'react-redux';
import { SSL_OP_PKCS1_CHECK_2 } from 'constants';
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import _ from 'lodash';
import JobLoadTable from './tableJobLoads';
import ManagedLocationEntity from 'entities/ManagedLocation/action';

class JobDetailPanel extends React.Component {
    componentWillMount = () => {
        if (!this.props.clientLocationsFetched) {
            this.props.getClientLocations({
                id: _.get(this.props.row, 'client.id'),
            });
        }
    };

    render() {
        return (
            <div className="job-details-PagingPanel ">
                <div className="panel-tile ">LOADS:</div>
                <JobLoadTable {...this.props} />
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        getClientLocations: params => {
            dispatch(ManagedLocationEntity.ui.listClient(params));
        },
    };
};
const mapStateToProps = (state, ownProps) => {
    return {
        clientLocationsFetched:
            _.size(state.managedLocationsReducer.clientLocations) > 0 && state.managedLocationsReducer.clientLocations[0].managedByCompanyId === _.get(ownProps.row, 'client.id'),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(JobDetailPanel);
