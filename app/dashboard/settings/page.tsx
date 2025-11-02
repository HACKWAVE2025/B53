export default function SettingsPage() {
  return (
    <div className="flex h-full w-full flex-col gap-4">
      <h1 className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">
        Settings
      </h1>
      <div className="flex flex-col gap-4">
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Account Settings
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  Email Notifications
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Receive email updates about your account
                </p>
              </div>
              <button className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600">
                Toggle
              </button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-neutral-800 dark:text-neutral-200">
                  Two-Factor Authentication
                </p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Add an extra layer of security
                </p>
              </div>
              <button className="rounded-md bg-neutral-200 px-4 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-300 dark:bg-neutral-700 dark:text-neutral-200 dark:hover:bg-neutral-600">
                Enable
              </button>
            </div>
          </div>
        </div>
        <div className="rounded-lg border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-800">
          <h2 className="mb-4 text-xl font-semibold text-neutral-800 dark:text-neutral-200">
            Preferences
          </h2>
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Theme
              </label>
              <select className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-neutral-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
                <option>Light</option>
                <option>Dark</option>
                <option>System</option>
              </select>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-800 dark:text-neutral-200">
                Language
              </label>
              <select className="w-full rounded-md border border-neutral-300 bg-white px-4 py-2 text-neutral-800 focus:border-neutral-500 focus:outline-none dark:border-neutral-600 dark:bg-neutral-700 dark:text-neutral-200">
                <option>English</option>
                <option>Spanish</option>
                <option>French</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
