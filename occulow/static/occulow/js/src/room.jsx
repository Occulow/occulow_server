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
      <div>
        <h4>{this.props.name}: {this.state.count}</h4>
        <h5>Sensors</h5>
        <ul className="collapsible" data-collapsible="accordion">
          {sensors}
        </ul>
      </div>
    );
  }
}

export default Room;