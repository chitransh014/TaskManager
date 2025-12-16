export default function TaskSkeleton() {
  return (
    <div className="glass p-5 rounded-xl animate-pulse">
      <div className="h-5 w-3/4 bg-white/30 rounded mb-3"></div>
      <div className="h-4 w-full bg-white/20 rounded mb-2"></div>
      <div className="h-4 w-5/6 bg-white/20 rounded"></div>

      <div className="flex justify-between mt-4">
        <div className="h-4 w-20 bg-white/20 rounded"></div>
        <div className="h-4 w-24 bg-white/20 rounded"></div>
      </div>
    </div>
  );
}
