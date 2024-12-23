"use client";

import PropTypes from "prop-types";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js modules
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function BarChart({ data, options }) {
  return <Bar data={data} options={options} />;
}

BarChart.propTypes = {
  data: PropTypes.object.isRequired,
  options: PropTypes.object.isRequired,
};
