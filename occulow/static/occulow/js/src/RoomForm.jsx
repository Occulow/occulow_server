import React from 'react';
import 'materialize-css';

class RoomForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      count: 0
    };
  }

  componentDidMount() {
    
  }

  submit() {
    var data = {
      name: this.state.name,
      count: this.state.count
    };

    $.ajax({
      url: this.props.url,
      type: 'POST',
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      data: JSON.stringify(data),
      cache: false,
      success: function(data) {
        this.props.onNewRoom(data);
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

  onCountUpdate(event) {
    this.setState({
      count: event.target.value
    });
  }

  render() {
    return (
      <div>
          <h4>Create new room</h4>
          <div className="input-field inline">
            <label htmlFor="name">Room name</label>
            <input type="text" name="name" onChange={this.onNameUpdate.bind(this)} value={this.state.name}/>
          </div>
          <div className="input-field inline">
            <label htmlFor="count">Initial count</label>
            <input type="number" min="0" name="count" onChange={this.onCountUpdate.bind(this)} value={this.state.count}/>
          </div>
          <div className="input-field inline">
            <a className="waves-effect waves-light btn" onClick={this.submit.bind(this)}>Create Room</a>
          </div>
      </div>
    )
  }
}

export default RoomForm;