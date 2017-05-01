import React from 'react';
import * as d3 from 'd3';

class OccupancyChart extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var margin = {top: 5, right: 50, bottom: 20, left: 50},
      w = this.props.width - (margin.left + margin.right),
      h = this.props.height - (margin.top + margin.bottom);

    //console.log(this.props.data)
    var parseDate = d3.timeParse("%I:%M:%S");

    var x = d3.scaleTime()
      .rangeRound([0, w]);
    

    var y = d3.scaleLinear()
      .rangeRound([h, 0]);
    
    var line = d3.line()
      .x(function (d) {
        return x(parseDate(d.d3_time));
      })
      .y(function (d) {
        return y(+d.delta);
      })

    x.domain(d3.extent(this.props.data, function(d) { return parseDate(d.d3_time); }));
    y.domain(d3.extent(this.props.data, function(d) { return +d.delta; }));

    var transform='translate(' + margin.left + ',' + margin.top + ')';

    return (
      <div>
        <svg id={this.props.chartId} width={this.props.width} height={this.props.height}>
          <g transform={transform}>
            <path fill="none" d={line(this.props.data)} strokeLinecap="round" stroke="steelblue" strokeWidth="1.5"/>
          </g>
        </svg>
      </div>
    );

  }
}

export default OccupancyChart;