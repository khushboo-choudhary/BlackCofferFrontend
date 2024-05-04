import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const PestleChart = ({ data, filters }) => {
  const svgRef = useRef();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let filteredData = data;

    if (filters) {
      const filterKeys = Object.keys(filters);
      filteredData = filteredData.filter((item) =>
        filterKeys.every((key) => !filters[key] || item[key] === filters[key])
      );
    }

    const counts = filteredData.reduce((acc, item) => {
      const key = item.pestle;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const chartDataPart = Object.entries(counts).map(([pestle, value]) => ({
      label: pestle,
      value,
    }));
    setChartData(chartDataPart);
  }, [data, filters]);

  useEffect(() => {
    if (chartData.length === 0) return;

    const width = 500;
    const height = 500;
    const margin = 50;
    const radius = Math.min(width, height) / 2 - margin;

    const colorScale = d3.scaleOrdinal(d3.schemeCategory10);

    const svg = d3
      .select(svgRef.current)
      .append("g")
      .attr("transform", `translate(${width / 2}, ${height / 2})`);

    const x = d3
      .scaleBand()
      .range([0, 2 * Math.PI])
      .align(0)
      .domain(chartData.map((d) => d.label))
      .padding(0.01);

    const y = d3
      .scaleRadial()
      .range([0, radius])
      .domain([0, d3.max(chartData, (d) => d.value)]);

    svg
      .selectAll("path")
      .data(chartData)
      .enter()
      .append("path")
      .attr("fill", (d) => colorScale(d.label))
      .attr(
        "d",
        d3
          .arc()
          .innerRadius(0)
          .outerRadius((d) => y(d.value))
          .startAngle((d) => x(d.label))
          .endAngle((d) => x(d.label) + x.bandwidth())
          .padAngle(0.01)
          .padRadius(radius)
      );

    const legend = svg
      .selectAll(".legend")
      .data(chartData)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", (_, i) => `translate(130, ${i * 30})`);

    legend
      .append("rect")
      .attr("x", width - margin - 20)
      .attr("y", -180)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", (_, i) => colorScale(i));

    legend
      .append("text")
      .attr("x", width - margin - 26)
      .attr("y", -170)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text((d) => d.label);
  }, [chartData]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <h1 style={{ marginBottom: "50px" }}>Pestle Based Filter</h1>
      <svg ref={svgRef} width={1200} height={500}></svg>
    </div>
  );
};

export default PestleChart;
