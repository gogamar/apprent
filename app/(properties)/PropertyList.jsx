import PropertyCard from "./PropertyCard";

async function getProperties() {
  const res = await fetch("http://localhost:4000/properties", {
    next: {
      revalidate: 0, // use 0 to opt out of using cache
    },
  });

  return res.json();
}

export default async function PropertyList() {
  const properties = await getProperties();
  console.log("properties", properties);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
        {properties.map((propertyObj) => {
          // Extract the first (and only) key-value pair from each object in the array
          const [baseUrl, propertyDetails] = Object.entries(propertyObj)[0];

          return (
            <PropertyCard
              key={baseUrl} // Use baseUrl as the unique key
              baseUrl={baseUrl}
              imageUrl={propertyDetails.imageUrl}
              location={propertyDetails.location}
              title={propertyDetails.title}
              details={propertyDetails.details}
              score={propertyDetails.score}
            />
          );
        })}

        {properties.length === 0 && (
          <p className="text-center">No properties found.</p>
        )}
      </div>
      <div className="flex mt-16 justify-center items-center">pagination</div>
    </>
  );
}
