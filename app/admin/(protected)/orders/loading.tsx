export default function OrdersLoading() {
  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="h-9 w-40 bg-nude-light rounded animate-pulse mb-2" />
        <div className="h-4 w-24 bg-nude-light rounded animate-pulse" />
      </div>

      <div className="flex gap-2 mb-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-8 w-24 bg-nude-light rounded-full animate-pulse" />
        ))}
      </div>

      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="card p-6">
            <div className="flex justify-between mb-4">
              <div className="space-y-2">
                <div className="h-5 w-36 bg-nude-light rounded animate-pulse" />
                <div className="h-4 w-52 bg-nude-light rounded animate-pulse" />
                <div className="h-3 w-28 bg-nude-light rounded animate-pulse" />
              </div>
              <div className="space-y-2 items-end flex flex-col">
                <div className="h-7 w-20 bg-nude-light rounded animate-pulse" />
                <div className="h-8 w-32 bg-nude-light rounded animate-pulse" />
              </div>
            </div>
            <div className="border-t border-nude-light pt-4 space-y-2">
              <div className="h-4 w-full bg-nude-light rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-nude-light rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
