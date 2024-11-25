import CreateForm from "./CreateForm";

export default async function CreateProperty() {
  return (
    <main>
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Your Property
      </h2>
      <CreateForm />
    </main>
  );
}
