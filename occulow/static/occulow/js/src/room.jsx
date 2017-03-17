import React from 'react';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {count: props.count};
  }

  render() {
    return (
      <li>
        <div className="collapsible-header">
          <h4>{this.props.name}: {this.state.count}</h4>
        </div>
        <div className="collapsible-body">
          Foo
        </div>
      </li>
    );
  }
}

export default Room;