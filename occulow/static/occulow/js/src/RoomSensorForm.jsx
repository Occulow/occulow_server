import React from 'react';
import ReactDOM from 'react-dom'

class RoomSensorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sensor: 0,
      room: 0,
      polarity: 1
    };
  }

  submit() {
    var data = {
      sensor: this.state.sensor,
      polarity: this.state.polarity
    };
    console.log(data)

    $.ajax({
      url: '/v1/rooms/' + this.state.room + '/sensors/',
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      cache: false,
      success: function(data) {
        this.props.onNewRoomSensor(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  componentDidUpdate(prevProps, prevState) {
    $('select').material_select();
  }

  componentDidMount() {
    // Hacks for materialize select
    $(ReactDOM.findDOMNode(this.refs.sensorSel)).on('change',this.onSensorUpdate.bind(this));
    $(ReactDOM.findDOMNode(this.refs.roomSel)).on('change',this.onRoomUpdate.bind(this));
    $(ReactDOM.findDOMNode(this.refs.polaritySel)).on('change',this.onPolarityUpdate.bind(this));
  }

  onSensorUpdate(event) {
    console.log(event.target.value)
    this.setState({
      sensor: event.target.value
    });
  }

  onRoomUpdate(event) {
    console.log(event.target.value)
    this.setState({
      room: event.target.value
    });
  }

  onPolarityUpdate(event) {
    this.setState({
      polarity: event.target.value
    });
  }

  render() {
    const sensors = this.props.sensors.map((sensor) =>
      <option value={sensor.id} key={sensor.id.toString()}>{sensor.name}</option>
    );
    const rooms = this.props.rooms.map((room) =>
      <option value={room.id} key={room.id.toString()}>{room.name}</option>
    );
    return (
      <div>
          <h4>Add sensor to room</h4>
          <div className="input-field inline">
            <select ref="roomSel" name="room" onChange={this.onRoomUpdate.bind(this)} value={this.state.room}>
              {rooms}
            </select>
            <label htmlFor="room">Room</label>
          </div>
          <div className="input-field inline">
            <select ref="sensorSel" name="room_sensor" onChange={this.onSensorUpdate.bind(this)} value={this.state.sensor}>
              {sensors}
            </select>
            <label htmlFor="room_sensor">Sensor</label>
          </div>
          <div className="input-field inline">
            <select ref="polaritySel" name="polarity" onChange={this.onPolarityUpdate.bind(this)} value={this.state.polarity}>
              <option value={1}>Positive</option>
              <option value={-1}>Negative</option>
            </select>
            <label htmlFor="polarity">Polarity</label>
          </div>
          <div className="input-field inline">
            <a className="waves-effect waves-light btn" onClick={this.submit.bind(this)}>Create Room-Sensor Relationship</a>
          </div>
      </div>
    )
  }
}

export default RoomSensorForm;