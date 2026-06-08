import UserLayout from '@/layouts/user-layout';

interface User {
    name: string;
    email: string;
}

interface DashboardProps {
    user: User;
}

export default function UserDashboard({ user }: DashboardProps) {
    return (
        <UserLayout user={user}>
            <main className="flex-1 overflow-y-auto bg-gray-100 p-4 md:p-6 dark:bg-gray-900">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Dashboard Overview</h1>
                        <p className="text-gray-500 dark:text-gray-400">
                            Welcome back, {user.name}! Here's what's happening with your business today.
                        </p>
                    </div>

                    {/* put here your logic */}
                </div>
            </main>
        </UserLayout>
    );
}