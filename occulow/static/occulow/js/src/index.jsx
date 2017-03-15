import React from 'react';
import {render} from 'react-dom';
import Room from './room.jsx'

class App extends React.Component {
  render () {
    return (
        <div>
            <h1>Occulow</h1>
            <Room name="Library" />
        </div>
    );
  }
}

render(<App/>, document.getElementById('app'));