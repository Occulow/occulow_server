import React from 'react';

class SensorForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      dev_eui: ""
    };
  }

  submit() {
    var data = {
      name: this.state.name,
      dev_eui: this.state.dev_eui
    };

    $.ajax({
      url: this.props.url,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      cache: false,
      success: function(data) {
        this.props.onNewSensor(data);
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  }

  onNameUpdate(event) {
    this.setState({
      name: event.target.value
    });
  }

  onDevEUIUpdate(event) {
    this.setState({
      dev_eui: event.target.value
    });
  }

  render() {
    return (
      <div>
          <h4>Create new sensor</h4>
          <div className="input-field inline">
            <label htmlFor="sensor_name">Sensor name</label>
            <input type="text" name="sensor_name" onChange={this.onNameUpdate.bind(this)} value={this.state.name}/>
          </div>
          <div className="input-field inline">
            <label htmlFor="dev_eui">Dev EUI</label>
            <input type="text" name="dev_eui" onChange={this.onDevEUIUpdate.bind(this)} value={this.state.dev_eui}/>
          </div>
          <div className="input-field inline">
            <a className="waves-effect waves-light btn" onClick={this.submit.bind(this)}>Create Sensor</a>
          </div>
      </div>
    )
  }
}

export default SensorForm;