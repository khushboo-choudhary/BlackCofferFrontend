import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

const SWOTAnalysis = ({ data, filters }) => {
  const [barData, setBarData] = useState([]);
  const svgRef = useRef();

  useEffect(() => {
    let filteredDataCopy = [...data];
    for (const key in filters) {
      if (filters[key]) {
        filteredDataCopy = filteredDataCopy.filter(
          (item) => item[key] === filters[key]
        );
      }
    }

    const counts = filteredDataCopy.reduce((acc, item) => {
      const key = `${item.region}-${item.likelihood}-${item.intensity}-${item.relevance}`;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    const barChartData = Object.entries(counts).map(([key, value]) => {
      const [region, likelihood, intensity, relevance] = key.split("-");
      return {
        region,
        likelihood: parseFloat(likelihood) || 0,
        intensity: parseFloat(intensity) || 0,
        relevance: parseFloat(relevance) || 0,
        value,
      };
    });

    setBarData(barChartData);
  }, [data, filters]);

  useEffect(() => {
    if (barData.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 54, right: 28, bottom: 34, left: 80 };
    const width = 1200;
    const height = 620 - margin.top - margin.bottom;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom - margin.right;

    const subgroups = ["likelihood", "intensity", "relevance"];

    const x = d3
      .scaleBand()
      .domain(barData.map((d) => d.region))
      .range([30, innerWidth])
      .padding(0.2);

    svg
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    const y = d3.scaleLinear().domain([0, 100]).range([innerHeight, 0]);
    svg
      .append("g")
      .attr("transform", `translate(30,${420 - innerHeight})`)
      .attr("class", "y-axis")
      .call(d3.axisLeft(y));

    const xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding(0.2);

    const color = d3
      .scaleOrdinal()
      .domain(subgroups)
      .range(["green", "blue", "pink"]);

    svg
      .selectAll(".bar")
      .data(barData)
      .enter()
      .append("g")
      .attr("class", "bar")
      .attr("transform", function (d) {
        return `translate(${x(d.region)},0)`;
      })
      .selectAll("rect")
      .data(function (d) {
        return subgroups.map(function (key) {
          return { key: key, value: d[key] };
        });
      })
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return xSubgroup(d.key);
      })
      .attr("y", function (d) {
        return y(d.value);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return innerHeight - y(d.value);
      })
      .attr("fill", function (d) {
        return color(d.key);
      })
      .append("title");

    const legend = svg
      .selectAll(".legend")
      .data(subgroups)
      .enter()
      .append("g")
      .attr("class", "legend")
      .attr("transform", function (d, i) {
        return `translate(0,${i * 20})`;
      });

    legend
      .append("rect")
      .attr("x", innerWidth + 20)
      .attr("y", 0)
      .attr("width", 15)
      .attr("height", 15)
      .attr("fill", function (d) {
        return color(d);
      })
      .attr("cursor", "pointer");

    legend
      .append("text")
      .attr("x", innerWidth + 40)
      .attr("y", 7.5)
      .attr("dy", "0.35em")
      .text(function (d) {
        return d;
      });
  }, [barData]);

  return (
    <div style={{ marginBottom: "50px" }}>
      <h1 style={{ marginBottom: "50px" }}>
        Region Based likelihood, intensity, and relevance
      </h1>
      <svg ref={svgRef} width={1200} height={500}></svg>
    </div>
  );
};

export default SWOTAnalysis;
