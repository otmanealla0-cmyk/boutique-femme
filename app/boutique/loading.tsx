export default function HomeLoading() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <div className="w-full aspect-[16/6] bg-nude-medium rounded-sm animate-pulse" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
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
