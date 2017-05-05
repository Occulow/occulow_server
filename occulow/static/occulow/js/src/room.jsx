import React from 'react';
import Sensor from './sensor.jsx'
import update from 'immutability-helper';
import OccupancyChart from './OccupancyChart.jsx';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 0,
      count_history: [],
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
        });
        data.forEach((rs) =>{
          var reversed = rs.sensor.updates.slice(0).reverse()
          reversed.forEach((u) => {
            this._updateCount(u.delta*rs.polarity);
          });
        });
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
    var new_count = this.state.count + val;
    this.setState(update(this.state, {
      count: {$set: new_count},
      count_history: {$push: [new_count]}
    }));
  }

  _within24Hours(time) {
    const ONE_DAY = 60 * 60 * 1000 * 24;
    return ((new Date()) - time) < ONE_DAY;
  }

  _chartData() {
    var allUpdates = []
    this.state.sensors.forEach((rs) => {
      var newUpdates = rs.sensor.updates.filter((u) => this._within24Hours(u.time)).slice(0);
      newUpdates.forEach((u) => u.polarity = rs.polarity);
      allUpdates = allUpdates.concat(newUpdates);
    })

    allUpdates.sort((a,b) => a.id - b.id);

    var count = 0;
    var data = []
    allUpdates.forEach((u) => {
      count += u.delta * u.polarity;
      data.push({
        count: count,
        time: u.d3_time
      });
    });

    return data;
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
        <div className="card blue-grey lighten-4">
          <div className="card-content">
            <h3>{this.props.name}</h3>
            <h4>Current occupancy: <span className="light-blue-text text-darken-3">{this.state.count}</span></h4>
            <OccupancyChart width={800} height={400} chartId={this.props.name} data={this._chartData()}/>
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