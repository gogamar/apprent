"use client";

import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
// import { useAuthContext } from "@/app/context/AuthContext";
import BarChart from "@/app/components/BarChart";
import PieChart from "@/app/components/PieChart";
import ScraperTrigger from "@/app/components/ScraperTrigger";

export default function Dashboard() {
  // const { user, role, loading, error } = useAuthContext();
  const [properties, setProperties] = useState([]);
  const [locationCounts, setLocationCounts] = useState({});
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

        // Calculate location counts
        const locationCounts = {};
        fetchedProperties.forEach((property) => {
          const location = property.location;
          locationCounts[location] = (locationCounts[location] || 0) + 1;
        });
        setLocationCounts(locationCounts);

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

  // Prepare bar chart data
  const barChartData = {
    labels: Object.keys(locationCounts),
    datasets: [
      {
        label: "Number of Properties",
        data: Object.values(locationCounts),
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  // Prepare pie chart data
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
        text: "Number of Properties by Location",
      },
    },
  };

  return (
    <div>
      <h1>Dashboard</h1>
      <ScraperTrigger />
      <h2>Properties by Location</h2>
      <BarChart data={barChartData} options={barChartOptions} />
      <h2>Property Score Distribution</h2>
      <div className="w-1/3">
        <PieChart data={pieChartData} />
      </div>
    </div>
  );
}
