import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface GaugeProps {
  value: number; // 0 to 100
  label: string;
}

const Gauge: React.FC<GaugeProps> = ({ value, label }) => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = 300;
    const height = 160; // Semi-circle height
    const radius = Math.min(width, height * 2) / 2;
    const innerRadius = radius - 30;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    const g = svg
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height - 10})`);

    // Scale
    const scale = d3.scaleLinear().domain([0, 100]).range([-Math.PI / 2, Math.PI / 2]);

    // Arcs
    const arc = d3.arc<any>()
      .innerRadius(innerRadius)
      .outerRadius(radius)
      .startAngle((d) => scale(d.start)!)
      .endAngle((d) => scale(d.end)!);

    const zones = [
      { start: 0, end: 33, color: '#ef4444' }, // Red
      { start: 33, end: 66, color: '#94a3b8' }, // Grey
      { start: 66, end: 100, color: '#22c55e' }, // Green
    ];

    g.selectAll('path')
      .data(zones)
      .enter()
      .append('path')
      .attr('d', (d) => arc(d)!)
      .attr('fill', (d) => d.color)
      .attr('stroke', '#0f172a')
      .attr('stroke-width', 2);

    // Needle
    const needleAngle = scale(value)!;
    const needleLen = innerRadius - 10;
    
    // Needle Line
    g.append('line')
      .attr('x1', 0)
      .attr('y1', 0)
      .attr('x2', needleLen * Math.cos(needleAngle - Math.PI / 2))
      .attr('y2', needleLen * Math.sin(needleAngle - Math.PI / 2)) // Rotated -90deg logic
      .attr('stroke', 'white')
      .attr('stroke-width', 4)
      .attr('stroke-linecap', 'round');

    // Pivot circle
    g.append('circle')
      .attr('cx', 0)
      .attr('cy', 0)
      .attr('r', 6)
      .attr('fill', 'white');

    // Text Label
    g.append('text')
      .attr('x', 0)
      .attr('y', -40)
      .attr('text-anchor', 'middle')
      .attr('fill', 'white')
      .attr('font-size', '24px')
      .attr('font-weight', 'bold')
      .text(value.toFixed(0));
      
    g.append('text')
      .attr('x', 0)
      .attr('y', -15)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '14px')
      .text(label);

  }, [value, label]);

  return <svg ref={svgRef}></svg>;
};

export default Gauge;
