import React from 'react';
import $ from 'jquery'
import Room from './room.jsx'
import RoomForm from './RoomForm.jsx';
import SensorForm from './SensorForm.jsx';

class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rooms: []};
  }

  componentDidMount() {
    this.loadRooms();
  }

  loadRooms() {
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

  onNewRoom(data) {
    var arr = this.state.rooms;
    arr.push(data);
    this.setState({
      rooms: arr
    })
  }

  render() {
    const rooms = this.state.rooms.map((room) =>
      <Room 
        id={room.id}
        name={room.name}
        count={room.count}
        key={room.id.toString()}
        sensors_url={"/v1/rooms/" + room.id + "/sensors/"}/>
    );
    return (
      <div>
        <h2>Rooms</h2>
        {rooms}
        <RoomForm url={this.props.url} onNewRoom={this.onNewRoom.bind(this)}/>
        <SensorForm url={'/v1/sensors/'} />
      </div>
    );
  }
}

export default RoomList;