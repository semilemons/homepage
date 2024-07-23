// pages/index.tsx
import React from 'react';
import Page from './Page';
import D3Chart from './D3Chart';
import * as d3 from 'd3';

const Home = () => {
  const data = [
    { name: 'A', value: 10 },
    { name: 'B', value: 20 },
    { name: 'C', value: 30 },
    { name: 'D', value: 40 },
    { name: 'E', value: 50 },
  ];

  const renderBarChart = (svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>, props: any) => {
    const { data, width, height, margin } = props;

    const x = d3.scaleBand()
      .domain(data.map((d: any) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, (d: any) => d.value) || 0])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg.selectAll('rect')
      .data(data)
      .join('rect')
      .attr('x', (d: any) => x(d.name) || 0)
      .attr('y', (d: any) => y(d.value))
      .attr('height', (d: any) => y(0) - y(d.value))
      .attr('width', x.bandwidth())
      .attr('fill', 'steelblue');

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));
  };

  return (
    <Page title="D3.js Bar Chart in Next.js">
      <D3Chart
        data={data}
        width={400}
        height={200}
        margin={{ top: 20, right: 20, bottom: 30, left: 40 }}
        renderChart={renderBarChart}
      />
    </Page>
  );
};

export default Home;