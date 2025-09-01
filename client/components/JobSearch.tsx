import { useState } from 'react';
import { Input } from './ui/input';
import { Button } from './ui/button';

// A type for the search results. Based on Meilisearch's response structure.
type SearchResult = {
  hits: any[];
  query: string;
  processingTimeMs: number;
  limit: number;
  offset: number;
  estimatedTotalHits: number;
};

export function JobSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Search request failed');
      }
      const data = await response.json();
      setResults(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred during search.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Search for jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </Button>
      </div>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {results && (
        <div className="mt-4">
          <p>Found {results.estimatedTotalHits} jobs in {results.processingTimeMs}ms.</p>
          <ul className="mt-2 space-y-4">
            {results.hits.map((hit) => (
              <li key={hit.id} className="border p-4 rounded-md">
                <h3 className="text-lg font-bold">{hit.title}</h3>
                <p className="text-gray-600">{hit.location}</p>
                <p className="mt-2">{hit.description?.substring(0, 200)}...</p>
                <a href={hit.apply_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline mt-2 inline-block">
                  Apply Now
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
