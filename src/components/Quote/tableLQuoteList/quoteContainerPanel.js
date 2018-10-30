import * as React from 'react';
import { connect } from 'react-redux';
import { SSL_OP_PKCS1_CHECK_2 } from 'constants';
import { PagingPanel } from '@devexpress/dx-react-grid-material-ui';
import _ from 'lodash';
import QuoteLoadTable from './tableQuoteLoads';

class QuoteDetailPanel extends React.Component {
    componentWillMount = () => {};

    render() {
        return (
            <div className="quote-details-PagingPanel ">
                <div className="panel-tile ">LOADS:</div>
                <QuoteLoadTable {...this.props} />
            </div>
        );
    }
}
const mapDispatchToProps = (dispatch, ownProps) => {
    return {};
};

export default connect(null, mapDispatchToProps)(QuoteDetailPanel);
