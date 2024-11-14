import React, { useEffect } from 'react';
import * as d3 from 'd3';

// const data = [
//     {name:"Mark", value: 90},
//     {name:"Robert", value: 12},
//     {name:"Emily", value: 34},
//     {name:"Marion", value: 53},
//     {name:"Nicolas", value: 98},
//   ]

  

function PieChart(props) {
  const {
    APIdata,
//     outerRadius,
//     innerRadius,
  } = props;

  const outerRadius = 180;
  const innerRadius = 30;
  const margin = {
    top: 50, right: 50, bottom: 50, left: 50,
  };
  const width = 2 * outerRadius + margin.left + margin.right;
  const height = 2 * outerRadius + margin.top + margin.bottom;
  useEffect(() => {
    drawChart();
  }, [APIdata] );

  function drawChart() {

    var data = APIdata.reduce((acc, entry) => {
      const country = entry.country ? entry.country.trim() : "";
      const region = entry.region ? entry.region.trim() : "";
      const location = country || region;

      // Attempt to convert intensity and relevance to numbers
      const intensity = parseInt(entry.intensity, 10);
      const relevance = parseInt(entry.relevance, 10);

      // Only include entries with a valid location, intensity, and relevance
      if (location && !isNaN(intensity) && !isNaN(relevance)) {
        acc.push({ location, intensity, relevance });
      }
      return acc;
    }, []);
    // Object.keys(APIdata).map((key)=>{
    //   if(key === 'error') {
    //     d3.select('#pie-container').select('svg').remove();
    //     d3.select('#pie-container')
    //     .append('p').data(APIdata[key])
    //   }else{
    //     data.push({})
    //   }
    // })

    // draw the chart here
    const colorScale = d3
    .scaleSequential()
    .interpolator(d3.interpolateWarm)
    .domain([0, data.length]);

    // Remove the old svg
    d3.select('#pie-container').select('svg').remove();
    
    // Create new svg
    const svg = d3
      .select('#pie-container')
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    const arcGenerator = d3
        .arc()
        .innerRadius(innerRadius)
        .outerRadius(outerRadius);
    const pieGenerator = d3
      .pie()
      .padAngle(0)
      .value((d) => d.value);
    const arc = svg
      .selectAll()
      .data(pieGenerator(data))
      .enter();

    // Append sectors
    arc
      .append('path')
      .attr('d', arcGenerator)
      .style('fill', (_, i) => colorScale(i))
      .style('stroke', '#ffffff')
      .style('stroke-width', 0);
    // Append text labels
    arc
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('alignment-baseline', 'middle')
      .text((d) => d.data.name)
      .style('fill', '#ffffff')
      .attr('transform', (d) => {
        const [x, y] = arcGenerator.centroid(d);
        return `translate(${x}, ${y})`;
      });
  }

  return <div id="pie-container" />;
}

export default PieChart;