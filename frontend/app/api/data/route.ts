import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // In Docker, we should use the service name instead of localhost
    const backendUrl = process.env.NODE_ENV === 'production' 
      ? process.env.NEXT_PUBLIC_BACKEND_API_URL 
      : 'http://backend:5111';
    
    console.log('Connecting to backend at:', backendUrl);

    const response = await fetch(`${backendUrl}/api/data`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      error: null
    });
    
  } catch (error) {
    console.error('API route error:', error);
    
    const errorMessage = error instanceof Error 
      ? `Backend connection error: ${error.message}` 
      : 'Failed to connect to backend service';

    console.error('Detailed error:', errorMessage);
    
    return NextResponse.json({
      success: false,
      data: null,
      error: errorMessage
    }, { status: 500 });
  }
}
