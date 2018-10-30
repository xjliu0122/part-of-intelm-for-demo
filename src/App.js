import React from 'react';
import { Provider } from 'react-redux';
import PropTypes from 'prop-types';
import ReduxToastr from 'react-redux-toastr';

class App extends React.Component {
    static propTypes = {
        store: PropTypes.object.isRequired,
        routes: PropTypes.object.isRequired,
    };

    shouldComponentUpdate() {
        return false;
    }

    render() {
        return (
            <Provider store={this.props.store}>
                <div style={{ height: '100%', minWidth: '1366px' }}>
                    <div style={{ height: '100%' }}>{this.props.routes}</div>
                    <ReduxToastr
                        timeOut={2000}
                        newestOnTop={false}
                        preventDuplicates
                        position="bottom-center"
                        transitionIn="fadeIn"
                        transitionOut="fadeOut"
                        progressBar={false}
                    />
                </div>
            </Provider>
        );
    }
}

export default App;
