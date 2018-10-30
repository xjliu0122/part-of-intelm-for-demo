import Auth from 'services/firebase';

import React from 'react';
import ReactTimeout from 'react-timeout';

class HeartBeat extends React.Component {
    componentDidMount() {
        Auth.heartbeat();
        this.interval = setInterval(() => {
            Auth.heartbeat();
        }, 3500000);
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }
    render() {
        return <div />;
    }
}
export default ReactTimeout(HeartBeat);
