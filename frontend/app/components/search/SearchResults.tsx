'use client';

interface Repository {
  name: string;
  description: string;
  url: string;
  starCount: number;
  forkCount: number;
  primaryLanguage: string;
}

interface SearchResultsProps {
  repositories: Repository[] | null;
  error: string | null;
  isLoading: boolean;
}

export default function SearchResults({ repositories, error, isLoading }: SearchResultsProps) {
  if (isLoading) {
    return (
      <div className="mt-8 text-center" role="status" aria-label="Loading results">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent"></div>
        <span className="ml-2">Searching repositories...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mt-8 p-4 bg-red-50 text-red-700 rounded-lg" role="alert">
        <p>{error}</p>
      </div>
    );
  }

  if (!repositories?.length) {
    return null;
  }

  return (
    <div className="mt-8 w-full max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Repositories Found</h2>
      <div className="grid gap-4">
        {repositories.map((repo) => (
          <div 
            key={repo.name}
            className="p-4 border rounded-lg hover:shadow-md transition-shadow"
            aria-labelledby={`repo-${repo.name}-title`}
          >
            <h3 id={`repo-${repo.name}-title`} className="text-xl font-semibold">
              <a 
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {repo.name}
              </a>
            </h3>
            {repo.description && (
              <p className="mt-2 text-gray-600">{repo.description}</p>
            )}
            <div className="mt-3 flex gap-4 text-sm text-gray-500">
              <span aria-label={`${repo.starCount} stars`}>⭐ {repo.starCount}</span>
              <span aria-label={`${repo.forkCount} forks`}>🍴 {repo.forkCount}</span>
              {repo.primaryLanguage && (
                <span aria-label={`Primary language: ${repo.primaryLanguage}`}>
                  💻 {repo.primaryLanguage}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
