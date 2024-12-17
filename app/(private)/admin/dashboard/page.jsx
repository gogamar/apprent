import { adminDb } from "@/lib/firebaseAdmin";
import BarChart from "@/app/components/BarChart";
import PieChart from "@/app/components/PieChart";
import ScraperTrigger from "@/app/components/ScraperTrigger";

// Server Component
export default async function Dashboard() {
  // Fetch properties directly from Firestore using Firebase Admin SDK
  const propertiesRef = adminDb.collection("properties");
  const snapshot = await propertiesRef.get();

  const properties = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
    };
  });

  // Calculate country counts
  const countryCounts = properties.reduce((counts, property) => {
    const country = property.country || "Unknown";
    counts[country] = (counts[country] || 0) + 1;
    return counts;
  }, {});

  // Calculate score counts
  const scoreCounts = {
    below7: 0,
    from7to8: 0,
    from8to9: 0,
    from9to10: 0,
  };

  properties.forEach((property) => {
    const score = parseFloat(property.score);
    if (score < 7) scoreCounts.below7 += 1;
    if (score >= 7 && score < 8) scoreCounts.from7to8 += 1;
    if (score >= 8 && score < 9) scoreCounts.from8to9 += 1;
    if (score >= 9 && score <= 10) scoreCounts.from9to10 += 1;
  });

  // Prepare chart data
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
    labels: ["Score < 7", "Score 7 - 8", "Score 8 - 9", "Score 9 - 10"],
    datasets: [
      {
        label: "Property Scores",
        data: [
          scoreCounts.below7,
          scoreCounts.from7to8,
          scoreCounts.from8to9,
          scoreCounts.from9to10,
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
      legend: { position: "top" },
      title: {
        display: true,
        text: "Number of Properties by Country",
      },
    },
  };

  // Return the dashboard UI
  return (
    <div className="min-h-screen">
      <ScraperTrigger />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Pie Chart Section */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-center mb-4 text-gray-700">
            Property Score Distribution
          </h2>
          <div className="flex justify-center items-center">
            <PieChart data={pieChartData} />
          </div>
        </div>
        {/* Bar Chart Section */}
        <div className="bg-gray-100 shadow-md rounded-lg p-6">
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
