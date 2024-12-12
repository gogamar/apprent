"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import BarChart from "@/app/components/BarChart";
import PieChart from "@/app/components/PieChart";
import ScraperTrigger from "@/app/components/ScraperTrigger";

export default function Dashboard() {
  const [properties, setProperties] = useState([]);
  const [countryCounts, setCountryCounts] = useState({});
  const [scoreCounts, setScoreCounts] = useState({
    below7: 0,
    aboveOrEqual7: 0,
    aboveOrEqual8: 0,
    aboveOrEqual9: 0,
  });

  useEffect(() => {
    // Fetch properties if the user is admin
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties", {
          method: "GET",
        });
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const fetchedProperties = await response.json();
        setProperties(fetchedProperties);

        // Calculate country counts
        const countryCounts = {};
        fetchedProperties.forEach((property) => {
          const country = property.country;
          countryCounts[country] = (countryCounts[country] || 0) + 1;
        });
        setCountryCounts(countryCounts);

        // Calculate score counts
        const scoreCounts = {
          below7: 0,
          aboveOrEqual7: 0,
          aboveOrEqual8: 0,
          aboveOrEqual9: 0,
        };
        fetchedProperties.forEach((property) => {
          const score = parseFloat(property.score);
          if (score < 7) scoreCounts.below7 += 1;
          if (score >= 7) scoreCounts.aboveOrEqual7 += 1;
          if (score >= 8) scoreCounts.aboveOrEqual8 += 1;
          if (score >= 9) scoreCounts.aboveOrEqual9 += 1;
        });
        setScoreCounts(scoreCounts);
      } catch (err) {
        console.error("Error fetching properties:", err);
        redirect("/");
      }
    };

    fetchProperties();
  }, []);

  const barChartData = {
    labels: Object.keys(countryCounts),
    datasets: [
      {
        label: "Number of Properties",
        data: Object.values(countryCounts),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const pieChartData = {
    labels: ["Score < 7", "Score ≥ 7", "Score ≥ 8", "Score ≥ 9"],
    datasets: [
      {
        label: "Property Scores",
        data: [
          scoreCounts.below7,
          scoreCounts.aboveOrEqual7,
          scoreCounts.aboveOrEqual8,
          scoreCounts.aboveOrEqual9,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.5)",
          "rgba(54, 162, 235, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(75, 192, 192, 0.5)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const barChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Number of Properties by country",
      },
    },
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <ScraperTrigger />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Pie Chart Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
            Property Score Distribution
          </h2>
          <div className="flex justify-center items-center">
            <PieChart data={pieChartData} />
          </div>
        </div>
        {/* Bar Chart Section */}
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
            Properties by Country
          </h2>
          <div className="flex justify-center items-center">
            <BarChart data={barChartData} options={barChartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
