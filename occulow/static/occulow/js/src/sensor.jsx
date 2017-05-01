import React from 'react';
import OccupancyChart from './OccupancyChart.jsx';

class Sensor extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    $('.collapsible').collapsible();
  }

  render() {
    const updates = this.props.updates.map((update) => 
      <tr key={update.id.toString()}>
        <td>{update.formatted_time}</td>
        <td>{update.count_in}</td>
        <td>{update.count_out}</td>
        <td>{update.delta * this.props.polarity}</td>
      </tr>
    );

    return (
      <li>
        <div className="collapsible-header white">
          <h5>{this.props.name} sensor</h5>
        </div>
        <div className="collapsible-body">
          <OccupancyChart width={400} height={200} chartId={this.props.name} data={this.props.updates}/>
          <p>Dev EUI: {this.props.dev_eui}</p>
          <p>Polarity: {this.props.polarity}</p>
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