import Image from "next/image";
import SearchForm from '@/app/components/search/SearchForm';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">GitHub Repository Explorer</h1>
      <p className="text-lg mb-8 text-gray-600">Enter a GitHub username to explore their repositories</p>
      <SearchForm />
    </main>
  );
}
