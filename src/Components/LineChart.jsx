import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const LineChart = ({ data, filters }) => {
  const svgRef = useRef();
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let filteredData = data;

    if (filters && filters.end_year) {
      filteredData = filteredData.filter(
        (item) => item.end_year === filters.end_year
      );
    }

    const sourceCounts = filteredData.reduce((acc, item) => {
      const key = item.source;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const sortedSources = Object.keys(sourceCounts).sort(
      (a, b) => sourceCounts[b] - sourceCounts[a]
    );

    const top5Sources = sortedSources.slice(0, 5);

    const chartData = top5Sources.map((source) => ({
      source,
      counts: filteredData.filter((item) => item.source === source).length,
    }));

    setChartData(chartData);
  }, [data, filters]);

  useEffect(() => {
    if (chartData.length === 0) return;

    const width = 600;
    const height = 400;
    const margin = { top: 20, right: 30, bottom: 30, left: 60 };

    const xScale = d3
      .scaleBand()
      .domain(chartData.map((d) => d.source))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.counts)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    const line = d3
      .line()
      .x((d) => xScale(d.source) + xScale.bandwidth() / 2)
      .y((d) => yScale(d.counts));

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale))
      .append("text")
      .attr("x", 10)
      .attr("y", 10)
      .attr("dy", "0.32em")
      .attr("fill", "#000")
      .text("Counts");

    svg
      .append("path")
      .datum(chartData)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-width", 1.5)
      .attr("d", line);

    svg
      .selectAll("circle")
      .data(chartData)
      .enter()
      .append("circle")
      .attr("cx", (d) => xScale(d.source) + xScale.bandwidth() / 2)
      .attr("cy", (d) => yScale(d.counts))
      .attr("r", 5)
      .attr("fill", "steelblue");
  }, [chartData]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <h1 style={{ marginBottom: "50px" }}>Top 5 source Contribution</h1>
      <svg ref={svgRef} width={800} height={500}></svg>
    </div>
  );
};

export default LineChart;
