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
    $.ajax({
      url: this.props.updates_url,
      dataType: 'json',
      success: function(data) {
        this.setState({
          updates: data
        })
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
        <td>{update.value}</td>
      </tr>
    );
    return (
      <li>
        <div className="collapsible-header">
          <h5>{this.state.name} - {this.state.dev_eui}</h5>
        </div>
        <div className="collapsible-body">
          <h5>Updates</h5>
          <table>
            <thead>
              <tr>
                <th>Time</th>
                <th>Value</th>
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