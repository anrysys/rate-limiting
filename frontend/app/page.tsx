'use client';

import { useState } from 'react';
import SearchForm from './components/search/SearchForm';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';

export default function HomePage() {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: inputValue }),
      });
      const result = await response.json();
      if (result.success) {
        setInputValue('');
        alert('Data sent successfully!');
      } else {
        alert(result.error || 'Failed to send data');
      }
    } catch (error) {
      alert('Error sending data');
    }
  };

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Rate Limiting Test</h1>
      <form onSubmit={handleSubmit} className="max-w-md space-y-4">
        <div className="space-y-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter your data"
            aria-label="Data input field"
            required
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          aria-label="Submit data"
          className="w-full"
        >
          Submit
        </Button>
      </form>
      <h1 className="text-4xl font-bold mb-8">GitHub Repository Explorer</h1>
      <p className="text-lg mb-8 text-gray-600">Enter a GitHub username to explore their repositories</p>
      <SearchForm />
    </main>
  );
}
