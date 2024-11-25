import BarChart from "../components/BarChart";
import PieChart from "../components/PieChart";

// Server-side data fetching function
async function getProperties() {
  const res = await fetch("http://localhost:4000/properties", {
    cache: "no-store", // Prevent caching
  });

  if (!res.ok) {
    throw new Error("Failed to fetch properties");
  }

  return res.json();
}

export default async function Dashboard() {
  // Fetch properties on the server
  const properties = await getProperties();

  // Count properties by location
  const locationCounts = {};
  properties.forEach((property) => {
    const location = Object.values(property)[0].location;
    locationCounts[location] = (locationCounts[location] || 0) + 1;
  });

  // Count properties by score ranges
  const scoreCounts = {
    below7: 0,
    aboveOrEqual7: 0,
    aboveOrEqual8: 0,
    aboveOrEqual9: 0,
  };

  properties.forEach((property) => {
    const score = parseFloat(Object.values(property)[0].score);

    if (score < 7) scoreCounts.below7 += 1;
    if (score >= 7) scoreCounts.aboveOrEqual7 += 1;
    if (score >= 8) scoreCounts.aboveOrEqual8 += 1;
    if (score >= 9) scoreCounts.aboveOrEqual9 += 1;
  });

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
      <h2>Properties by Location</h2>
      <BarChart data={barChartData} options={barChartOptions} />
      <h2>Property Score Distribution</h2>
      <div className="w-1/3">
        <PieChart data={pieChartData} />
      </div>
    </div>
  );
}
