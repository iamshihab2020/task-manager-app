import { redirect } from "next/navigation";

import Navbar from "../../components/Navbar";
import { getCurrentUser } from "../../lib/auth";
import DashboardClient from "@/components/DashboardClient";

export default async function DashboardPage() {
  // Get user 
  const user = await getCurrentUser();

  if (!user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Navbar user={{ name: user.name, email: user.email }} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Top  Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-600">
            Ready to tackle your tasks? Let's make today productive.
          </p>
        </div>

        {/* Main Dashboard */}
        <DashboardClient />
      </div>
    </div>
  );
}
