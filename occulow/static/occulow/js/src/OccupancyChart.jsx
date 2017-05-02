import React from 'react';
import * as d3 from 'd3';

class OccupancyChart extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      transorm: '',
      line: ((d) => '')
    }
  }

  componentWillReceiveProps(nextProps) {
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
        return x(parseDate(d.time));
      })
      .y(function (d) {
        return y(+d.count);
      })

    x.domain(d3.extent(this.props.data, function(d) { return parseDate(d.time); }));
    y.domain(d3.extent(this.props.data, function(d) { return +d.count; }));

    var transform='translate(' + margin.left + ',' + margin.top + ')';

    var xTransform = 'translate(0,' + h + ')';
    d3.select(this.xAxis)
      .attr('transform', xTransform)
      .call(d3.axisBottom(x));

    d3.select(this.yAxis)
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Occupancy");

    d3.select(this.title)
      .attr("x", (w / 2))             
      .attr("y", 0 + (margin.top * 2))
      .attr("text-anchor", "middle")  
      .style("font-size", "16px") 
      .style("text-decoration", "underline")  
      .text("Occupancy over the last 24 hours");

    this.setState({
      transform: transform,
      line: line
    })
  }

  render() {
    return (
      <div>
        <svg id={this.props.chartId} width={this.props.width} height={this.props.height}>
          <g transform={this.state.transform}>
            <text ref={(e) => { this.title = e; }} />
            <path fill="none" d={this.state.line(this.props.data)} strokeLinecap="round" stroke="steelblue" strokeWidth="1.5"/>
            <g ref={(e) => { this.xAxis = e; }} />
            <g ref={(e) => { this.yAxis = e; }} />
          </g>
        </svg>
      </div>
    );

  }
}

export default OccupancyChart;