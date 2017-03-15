import React from 'react';
import {render} from 'react-dom';
import RoomList from './roomList.jsx'

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return (
      <div>
        <h1>Occulow</h1>
        <RoomList url='/v1/rooms/'/>
      </div>
    );
  }
}

render(<App/>, document.getElementById('app'));