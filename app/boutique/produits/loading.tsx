export default function ProduitsLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="h-8 w-48 bg-nude-medium rounded animate-pulse mb-8" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-[3/4] bg-nude-medium rounded-sm animate-pulse" />
            <div className="h-4 bg-nude-medium rounded animate-pulse w-3/4" />
            <div className="h-4 bg-nude-medium rounded animate-pulse w-1/3" />
          </div>
        ))}
      </div>
    </div>
  )
}
