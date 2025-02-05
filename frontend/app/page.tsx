import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">GitHub Repository Explorer</h1>
      <p className="mt-4">Enter a GitHub username to explore their repositories</p>
    </main>
  );
}
