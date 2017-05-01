import React from 'react';
import Sensor from './sensor.jsx'
import update from 'immutability-helper';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: this.props.count,
      sensors: []
    };
  }

  componentDidMount() {
    this.loadSensors();

    var intervalId = setInterval(this.loadAllUpdates.bind(this), 5000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
   clearInterval(this.state.intervalId);
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

  loadAllUpdates() {
    this.state.sensors.forEach((rs, idx) => {
      this.loadNewUpdates(rs, idx);
    });
  }

  loadNewUpdates(rs, rs_idx) {
    var sensor = rs.sensor;

    var latest_id = -1;
    sensor.updates.forEach((u) => {
      if (u.id > latest_id)
        latest_id = u.id;
    });
    
    $.ajax({
      url: this._updateUrl(sensor.id, latest_id),
      dataType: 'json',
      success: function(data) {
        for (let i = data.length-1; i >= 0; i--) {
          this.setState(update(this.state, {
            sensors: {
              [rs_idx]: {
                sensor: {
                  updates: {$unshift: [data[i]]}
                }
              }
            }
          }));
          this._updateCount(data[i].delta*rs.polarity);
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.updates_url, status, err.toString());
      }.bind(this)
    });
  }

  _updateUrl(sensor_id, latest_id) {
    return "/v1/sensors/" + sensor_id + "/updates/?latest=" + latest_id;
  }

  _updateCount(val) {
    this.setState({count: this.state.count + val});
  }

  render() {
    const sensors = this.state.sensors.map((s) => 
      <Sensor
        id={s.sensor.id}
        key={s.sensor.id.toString()}
        polarity={s.polarity}
        name={s.sensor.name}
        dev_eui={s.sensor.dev_eui}
        updates={s.sensor.updates} />
    );
    return (
      <div className="section row">
        <div className="col s12 m10">
        <div className="card blue-grey lighten-2">
          <div className="card-content">
            <h3>{this.props.name}</h3>
            <h4>Current occupancy: <span className="light-blue-text text-darken-3">{this.state.count}</span></h4>
            <ul className="collapsible white" data-collapsible="accordion">
              {sensors}
            </ul>
          </div>
        </div>
        </div>
      </div>
    );
  }
}

export default Room;