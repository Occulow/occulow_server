import React from 'react';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.count};
  }

  render() {
    return (
      <li className="collection-item">
        <h4>{this.props.name}: {this.state.count}</h4>
      </li>
    );
  }
}

export default Room;