import React from 'react';

class Room extends React.Component {
    constructor(props) {
        super(props);
        this.state = {count: 0};
    }

    render() {
        return (
            <div>
                <h2>Name: {this.props.name}</h2>
            </div>
        );
    }
}

export default Room;