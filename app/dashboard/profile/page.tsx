export default function ProfilePage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
        Profile
      </h1>
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            User Information
          </h2>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Name
              </label>
              <p className="text-neutral-800 dark:text-neutral-200">
                Manu Arora
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Email
              </label>
              <p className="text-neutral-800 dark:text-neutral-200">
                manu@example.com
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                Role
              </label>
              <p className="text-neutral-800 dark:text-neutral-200">
                Administrator
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Activity
          </h2>
          <p className="text-neutral-600 dark:text-neutral-400">
            Recent activity and stats will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
