import React, { PropTypes, Component } from 'react';
import ReactDOM from 'react-dom';
import { Provider, connect } from 'react-redux';
import _ from 'lodash';
import {PulseLoader as Loader}  from 'halogenium';
import './styles.scss';

class SpinnerComponent extends Component {
    componentWillMount = () => {};

    render() {
        const visible = this.props.visible;
        return (
            <div>
                {visible && (
                    <div className="spinner-container">
                        <Loader color="#3f51b5" size="16px" margin="4px" />
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let isRequesting = false;
    _.forOwn(state, obj => {
        if (obj && obj.isRequesting) isRequesting = true;
    });
    return {
        visible: isRequesting,
    };
};

export default connect(mapStateToProps, {})(SpinnerComponent);
