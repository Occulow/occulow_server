import React from 'react';
import {render} from 'react-dom';

class App extends React.Component {
  render () {
    return <p> Hello React! Im watching you...</p>;
  }
}

render(<App/>, document.getElementById('app'));