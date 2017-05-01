import React from 'react';
import $ from 'jquery'
import Room from './room.jsx'
import RoomForm from './RoomForm.jsx';
import SensorForm from './SensorForm.jsx';
import RoomSensorForm from './RoomSensorForm.jsx';

class RoomList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {rooms: [], sensors: []};
  }

  componentDidMount() {
    this.loadRooms();
    this.loadSensors();
  }

  loadRooms() {
    $.ajax({
      url: this.props.room_url,
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

  loadSensors() {
    $.ajax({
      url: this.props.sensor_url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          sensors: data
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

  onNewRoomSensor(data) {
    
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
        {rooms}
        <RoomForm url={this.props.url} onNewRoom={this.onNewRoom.bind(this)}/>
        <SensorForm url={'/v1/sensors/'} />
        <RoomSensorForm sensors={this.state.sensors} rooms={this.state.rooms} />
      </div>
    );
  }
}

export default RoomList;