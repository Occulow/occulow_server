import React from 'react';
import 'materialize-css';
import {render} from 'react-dom';
import RoomList from './roomList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div className="container">
        <div className="row">
          <div className="col s12">
            <RoomList room_url='/v1/rooms/' sensor_url='/v1/sensors/'/>
          </div>
        </div>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));