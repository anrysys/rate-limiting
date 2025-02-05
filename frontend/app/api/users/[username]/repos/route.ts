import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not defined');
    }

    const username = params.username;
    const fullUrl = `${backendUrl}/users/${username}/repos`;
    console.log('Fetching repos from backend:', fullUrl);

    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: `Failed to fetch repositories: ${error.message}`,
      },
      { status: 500 }
    );
  }
}
