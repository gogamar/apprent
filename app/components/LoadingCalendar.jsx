export default function LoadingCalendar() {
  return (
    <div>
      <div className="my-6 animate-pulse">
        <div className="h-5 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-10 bg-gray-300 rounded w-1/3"></div>
      </div>
      <div className="animate-pulse">
        <div className="h-6 bg-gray-300 rounded w-1/5 mb-4"></div>
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-300 rounded"></div>
          ))}
        </div>
      </div>
    </div>
  );
}
