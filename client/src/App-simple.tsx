import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";

// Simple components without complex features
function SimpleDashboard() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">SpeakWorld Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Learning Progress</h2>
          <p className="text-gray-600">Continue your English learning journey</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Daily Challenge</h2>
          <p className="text-gray-600">Complete today's speaking exercise</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
          <p className="text-gray-600">View your learning achievements</p>
        </div>
      </div>
    </div>
  );
}

function SimpleNavigation() {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-blue-600">SpeakWorld</h1>
          </div>
          <div className="flex items-center space-x-6">
            <a href="/" className="text-gray-700 hover:text-blue-600">Dashboard</a>
            <a href="/learning" className="text-gray-700 hover:text-blue-600">Learning</a>
            <a href="/speaking" className="text-gray-700 hover:text-blue-600">Speaking</a>
            <a href="/games" className="text-gray-700 hover:text-blue-600">Games</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SimpleLearning() {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Learning Paths</h1>
      <div className="space-y-4">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">Beginner Level</h3>
          <p className="text-gray-600 mt-2">Start your English learning journey</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold">Intermediate Level</h3>
          <p className="text-gray-600 mt-2">Build on your existing knowledge</p>
        </div>
      </div>
    </div>
  );
}

function SimpleRouter() {
  return (
    <Switch>
      <Route path="/" component={SimpleDashboard} />
      <Route path="/learning" component={SimpleLearning} />
      <Route>
        <div className="max-w-4xl mx-auto p-6">
          <h1 className="text-3xl font-bold text-gray-900">Page Not Found</h1>
          <p className="text-gray-600 mt-4">The page you're looking for doesn't exist.</p>
        </div>
      </Route>
    </Switch>
  );
}

function SimpleApp() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <SimpleNavigation />
        <main>
          <SimpleRouter />
        </main>
      </div>
    </QueryClientProvider>
  );
}

export default SimpleApp;