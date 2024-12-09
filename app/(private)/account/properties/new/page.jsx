import PropertyForm from "@/app/components/PropertyForm";

export default async function CreateProperty() {
  return (
    <main>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Your Property
      </h2>
      <PropertyForm />
    </main>
  );
}
