import React, { useRef, useEffect } from "react";
import * as d3 from "d3";

const BarChart = ({ data, filters }) => {
  const ref = useRef();

  useEffect(() => {
    let filteredData = data;

    if (filters) {
      for (const key in filters) {
        if (filters[key]) {
          filteredData = filteredData.filter(
            (item) => item[key] === filters[key]
          );
        }
      }
    }

    filteredData.sort((a, b) => b.intensity - a.intensity);

    if (!Object.values(filters).some((value) => value)) {
      filteredData = filteredData.slice(0, 5);
    }

    const svg = d3.select(ref.current);
    const width = +svg.attr("width");
    const height = +svg.attr("height");
    const margin = { top: 20, right: 30, bottom: 60, left: 60 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3
      .scaleBand()
      .domain(filteredData.map((d) => d.topic))
      .range([margin.left, innerWidth])
      .padding(0.2);

    const yScale = d3
      .scaleLinear()
      .domain([0, 100])
      .range([innerHeight, margin.top]);

    svg.select(".x-axis").remove();
    svg.select(".y-axis").remove();
    svg
      .selectAll(".rect")
      .data(filteredData)
      .join("rect")
      .attr("class", "rect")
      .attr("x", (d) => xScale(d.topic))
      .attr("y", (d) => yScale(d.intensity))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => innerHeight - yScale(d.intensity))
      // .attr("fill", (d) => d.sector)
      .attr("fill", "orange")
      .append("title")
      .text((d) => yScale(d.intensity));

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("class", "y-axis")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale).tickFormat((d) => d.toFixed() + "%"));
  }, [data, filters]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <h1 style={{ marginBottom: "50px" }}>Top 5 Contribution In Topics</h1>
      <svg ref={ref} width={900} height={400} />
    </div>
  );
};

export default BarChart;
