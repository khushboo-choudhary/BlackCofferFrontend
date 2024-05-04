import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const PieChart = ({ data }) => {
  const [pieData, setPieData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    const counts = data.reduce((acc, item) => {
      const key = `${item.sector}-${item.country}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const pieChartData = Object.entries(counts).map(([key, value]) => {
      const [sector, country] = key.split("-");
      return {
        label: `${sector} (${value}) - (${country})`,
        value,
      };
    });

    setPieData(pieChartData);
  }, [data]);

  useEffect(() => {
    if (pieData.length === 0) return;

    const width = 400;
    const height = 400;
    const radius = Math.min(width, height) / 2;

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3.select(svgRef.current);

    const pie = d3.pie().value((d) => d.value);

    const arc = d3.arc().innerRadius(0).outerRadius(radius);

    const arcs = svg
      .selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc")
      .attr("transform", `translate(${width},${height / 2})`);

    arcs
      .append("path")
      .attr("d", arc)
      .attr("fill", (_, i) => color(i));

    const legend = svg
      .selectAll(".legend")
      .data(pieData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(${width},${i * 20})`);

    legend
      .append("rect")
      .attr("x", 300)
      .attr("width", 18)
      .attr("height", 18)
      .attr("fill", (_, i) => color(i));

    legend
      .append("text")
      .attr("x", 330)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "start")
      .text((d) => d.label);

    return () => svg.selectAll("*").remove();
  }, [pieData]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <h1 style={{ marginBottom: "60px" }}>Country based sector</h1>
      <svg ref={svgRef} width={1200} height={500}></svg>
    </div>
  );
};

export default PieChart;
