'use client';

import { useState } from 'react';
import SearchResults from './SearchResults';

export default function SearchForm() {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/users/${username}/repos`);
      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to fetch repositories');
      }
      
      setRepositories(data.data);
    } catch (err: any) {
      setError(err.message);
      setRepositories(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
          aria-label="GitHub username"
          className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-blue-300"
        ></button>
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </form>
      
      <SearchResults 
        repositories={repositories}
        error={error}
        isLoading={isLoading}
      />
    </div>
  );
}
