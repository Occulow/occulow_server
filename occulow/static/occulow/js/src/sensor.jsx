import React from 'react';

class Sensor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dev_eui: '',
      updates: [],
    };
  }

  componentDidMount() {
    this.loadSensor();
    this.loadUpdates();
    $('.collapsible').collapsible();

    var intervalId = setInterval(this.loadUpdates.bind(this), 5000);
    this.setState({intervalId: intervalId});
  }

  componentWillUnmount() {
   clearInterval(this.state.intervalId);
  }

  loadSensor() {
    $.ajax({
      url: this.props.sensor_url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          name: data.name,
          dev_eui: data.dev_eui
        })
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.sensor_url, status, err.toString());
      }.bind(this)
    });
  }

  loadUpdates() {
    var latest_id;
    if (this.state.updates.length > 0) {
      latest_id = this.state.updates[0].id
    } else {
      latest_id = -1
    }

    const url = this.props.updates_url + "?latest=" + latest_id;
    
    $.ajax({
      url: url,
      dataType: 'json',
      success: function(data) {
        var newArr = this.state.updates;
        for (let i = data.length-1; i >= 0; i--) {
          newArr.unshift(data[i]);
          this.props.onUpdate(data[i].delta*this.props.polarity);
        }
        this.setState({
          updates: newArr
        });
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.updates_url, status, err.toString());
      }.bind(this)
    });
  }

  render() {
    const updates = this.state.updates.map((update) => 
      <tr key={update.id.toString()}>
        <td>{update.formatted_time}</td>
        <td>{update.count_in}</td>
        <td>{update.count_out}</td>
        <td>{update.delta * this.props.polarity}</td>
      </tr>
    );
    return (
      <li>
        <div className="collapsible-header">
          <h5>{this.state.name} - {this.state.dev_eui} - {this.props.polarity}</h5>
        </div>
        <div className="collapsible-body">
          <h5>Updates</h5>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>In</th>
                <th>Out</th>
                <th>Delta (w/ polarity)</th>
              </tr>
            </thead>
            <tbody>
              {updates}
            </tbody>
          </table>
        </div>
      </li>
    );
  }
}

export default Sensor;