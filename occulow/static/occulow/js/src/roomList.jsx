import React from 'react';
import $ from 'jquery'

class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rooms: []};
  }

  componentDidMount() {
    this.loadRooms();
  }

  loadRooms() {
    console.log(this.props.url)
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          rooms: data
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    const rooms = this.state.rooms.map((room) =>
      <li key={room.id.toString()}>{room.name}</li>
    );
    return (
      <div>
        <h2>Rooms</h2>
        <ul>{rooms}</ul>
      </div>
    );
  }
}

export default RoomList;