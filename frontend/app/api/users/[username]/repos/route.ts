import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    // When running in Docker, use internal Docker network URL
    const backendUrl = 'http://backend:5111';
    const username = params.username;
    const fullUrl = `${backendUrl}/users/${username}/repos`;
    
    console.log('Frontend: Attempting to fetch from backend:', fullUrl);

    const response = await fetch(fullUrl, {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    console.error('Frontend API route error:', {
      message: error instanceof Error ? error.message : String(error),
    });
    
    return NextResponse.json(
      {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'Failed to fetch repositories',
      },
      { status: 500 }
    );
  }
}
