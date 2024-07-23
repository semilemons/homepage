// components/D3Chart.tsx
import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface ChartProps {
  data: any[];
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  renderChart: (svg: d3.Selection<SVGSVGElement | null, unknown, null, undefined>, props: ChartProps) => void;
}

const D3Chart: React.FC<ChartProps> = ({ data, width, height, margin, renderChart }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.selectAll('*').remove(); // Clear previous render
      renderChart(svg, { data, width, height, margin, renderChart });
    }
  }, [data, width, height, margin, renderChart]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};

export default D3Chart;