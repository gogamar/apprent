import { adminDb } from "@/lib/firebaseAdmin";
import Filters from "@/app/components/Filters";
import PropertyList from "@/app/components/PropertyList";

export default async function Properties() {
  const propertiesRef = adminDb.collection("properties");
  const snapshot = await propertiesRef.get();

  const viewsSet = new Set();
  const countriesSet = new Set();

  const properties = snapshot.docs.map((doc) => {
    const data = doc.data();

    if (data.views && Array.isArray(data.views)) {
      data.views.forEach((view) => viewsSet.add(view));
    }

    if (data.country && typeof data.country === "string") {
      countriesSet.add(data.country);
    }

    return {
      id: doc.id,
      ...data,
      createdAt: data.createdAt?.toDate().toISOString() || null,
      updatedAt: data.updatedAt?.toDate().toISOString() || null,
    };
  });

  const views = Array.from(viewsSet).map((view) => ({
    value: view,
    label: view,
  }));
  const countries = Array.from(countriesSet).map((country) => ({
    value: country,
    label: country,
  }));

  return (
    <div className="flex min-h-screen">
      <div className="w-1/4 bg-gray-100 border-r border-gray-200 p-4 hidden lg:block">
        <Filters views={views} countries={countries} />
      </div>
      <main className="flex-1 p-6">
        <PropertyList initialProperties={properties} />
      </main>
    </div>
  );
}
