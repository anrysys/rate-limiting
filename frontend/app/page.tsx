'use client';

import { GitHubRepoForm } from '@/app/components/GitHubRepoForm';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            GitHub Repository Explorer
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto">
            Enter a GitHub username to explore their public repositories with advanced filtering and rate limiting protection.
          </p>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl mx-auto bg-gray-800/50 backdrop-blur-sm rounded-xl shadow-2xl p-6 border border-gray-700">
          <GitHubRepoForm />
        </div>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-400 text-sm">
          <p>Built with Next.js, NestJS, and Redis</p>
          <p className="mt-2">
            <span className="inline-flex items-center space-x-1">
              <span>Rate Limited API Calls</span>
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
            </span>
          </p>
        </footer>
      </div>
    </main>
  );
}
