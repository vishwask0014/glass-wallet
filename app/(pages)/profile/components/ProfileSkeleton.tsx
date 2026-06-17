function SkeletonBlock({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      className={`animate-pulse rounded-2xl bg-white/10 ${className}`}
      aria-hidden="true"
    />
  );
}

export default function ProfileSkeleton() {
  return (
    <div className="page-shell py-6 sm:py-10">
      <section className="grid gap-4 lg:grid-cols-[0.92fr_1.08fr]">
        <aside className="glass-card-strong rounded-[2rem] p-6 sm:p-8">
          <SkeletonBlock className="h-4 w-20" />

          <div className="mt-5 flex items-center gap-4">
            <SkeletonBlock className="h-20 w-20 shrink-0 rounded-[1.7rem]" />
            <div className="flex-1 space-y-3">
              <SkeletonBlock className="h-8 w-40" />
              <SkeletonBlock className="h-4 w-52" />
            </div>
          </div>

          <div className="mt-6 space-y-2">
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-11/12" />
            <SkeletonBlock className="h-4 w-4/5" />
          </div>

          <div className="mt-8 space-y-4">
            {[1, 2, 3].map((field) => (
              <div key={field} className="space-y-2">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-12 w-full rounded-[1.15rem]" />
              </div>
            ))}
            <SkeletonBlock className="h-12 w-full rounded-[1.15rem]" />
          </div>
        </aside>

        <div className="glass-grid">
          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-28" />
                <SkeletonBlock className="h-8 w-36" />
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <SkeletonBlock className="h-24 w-full rounded-[1.25rem]" />
              <SkeletonBlock className="h-24 w-full rounded-[1.25rem]" />
            </div>
          </article>

          <article className="glass-card rounded-[1.8rem] p-6">
            <div className="flex items-center gap-4">
              <SkeletonBlock className="h-12 w-12 shrink-0 rounded-2xl" />
              <div className="flex-1 space-y-2">
                <SkeletonBlock className="h-4 w-32" />
                <SkeletonBlock className="h-8 w-40" />
              </div>
            </div>

            <div className="mt-5 space-y-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-3/4" />
            </div>
          </article>

          <article className="glass-card rounded-[1.8rem] p-6">
            <SkeletonBlock className="h-4 w-24" />
            <SkeletonBlock className="mt-3 h-8 w-56" />
            <div className="mt-3 space-y-2">
              <SkeletonBlock className="h-4 w-full" />
              <SkeletonBlock className="h-4 w-5/6" />
            </div>
          </article>
        </div>
      </section>
    </div>
  );
}
