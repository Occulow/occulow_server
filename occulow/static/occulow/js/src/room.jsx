import React from 'react';
import Sensor from './sensor.jsx'

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      sensors: []
    };
  }

  componentDidMount() {
    this.loadSensors();
  }

  loadSensors() {
    $.ajax({
      url: this.props.sensors_url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          sensors: data
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.sensors_url, status, err.toString());
      }.bind(this)
    });
  }

  updateCount(val) {
    this.setState({count: this.state.count + val});
  }

  render() {
    const sensors = this.state.sensors.map((s) => 
      <Sensor
        id={s.sensor.id}
        key={s.sensor.id.toString()}
        polarity={s.polarity}
        sensor_url={"/v1/sensors/" + s.sensor.id + "/"}
        updates_url={"/v1/sensors/" + s.sensor.id + "/updates/"}
        onUpdate={this.updateCount.bind(this)} />
    );
    return (
      <div className="section row">
        <div className="col s12 m8">
        <h3>{this.props.name}</h3>
        <h4>Current occupancy: <span className="light-blue-text">{this.state.count}</span></h4>
        <ul className="collapsible red lighten-2" data-collapsible="accordion">
          {sensors}
        </ul>
        </div>
      </div>
    );
  }
}

export default Room;