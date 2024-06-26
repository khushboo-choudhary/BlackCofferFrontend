import React, { useState, useEffect } from "react";
import axios from "axios";
import SWOTAnalysis from "./SWOTAnalysis";
import BarChart from "./BarChart";
import PieChart from "./PieChart";
import PestleChart from "./PestleChart";
import LineChart from "./LineChart";
import SpikeMap from "./SpikeMap";
import Button from "react-bootstrap/Button";

const Dashboard = () => {
  const [filters, setFilters] = useState({
    end_year: "",
    topic: "",
    sector: "",
    region: "",
    pestle: "",
    source: "",
    country: "",
  });
  const [originalData, setOriginalData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get(
        "https://blackcofferbackend-yz40.onrender.com/api"
      );
      const data = response.data.map((item) => {
        const filteredItem = {};
        for (const key in item) {
          if (item[key] && item[key] !== "") {
            filteredItem[key] = item[key];
          } else {
            filteredItem[key] = "Unknown";
          }
        }
        return filteredItem;
      });
      setOriginalData(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleApplyFilters = () => {
    let filteredDataCopy = [...originalData];
    for (const key in filters) {
      if (filters[key]) {
        filteredDataCopy = filteredDataCopy.filter(
          (item) => item[key] === filters[key]
        );
      }
    }
    setFilteredData(filteredDataCopy);
  };

  const handleFilterChange = (filterName, value) => {
    setFilters({ ...filters, [filterName]: value });
  };

  const clearFilters = () => {
    // Clear all filter keys by setting them to an empty string
    const updatedFilters = {
      end_year: "",
      topic: "",
      sector: "",
      region: "",
      pestle: "",
      source: "",
      country: "",
    };

    // Update the filters state with the modified filters object
    setFilters(updatedFilters);
  };
  return (
    <div className="dashboard-container">
      <div className="sidebar">
        <h1>Filters</h1>
        {Object.entries(filters).map(([filterName, value]) => (
          <select
            key={filterName}
            value={value}
            onChange={(e) => handleFilterChange(filterName, e.target.value)}
          >
            <option value="">{`Select ${
              filterName.charAt(0).toUpperCase() + filterName.slice(1)
            }`}</option>
            {[...new Set(originalData.map((item) => item[filterName]))]
              .filter((item) => item)
              .sort()
              .map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
          </select>
        ))}
        <div
          style={{
            display: "flex",
            justifyContent: "space-evenly",
            marginTop: "1rem",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          <Button onClick={handleApplyFilters} variant="success">
            Apply Filters
          </Button>
          <Button onClick={clearFilters} variant="success">
            Clear Filters
          </Button>
        </div>
      </div>
      <div className="content">
        <SWOTAnalysis data={filteredData} filters={filters} />
        <BarChart data={filteredData} filters={filters} />
        <PieChart data={filteredData} />
        <PestleChart data={filteredData} filters={filters} />
        <SpikeMap data={filteredData} filters={filters} />
        <LineChart data={filteredData} />
      </div>
    </div>
  );
};

export default Dashboard;
