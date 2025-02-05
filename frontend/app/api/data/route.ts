import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Using environment variable for backend URL
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://backend:5111';
    
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
    
    return NextResponse.json({
      success: false,
      data: null,
      error: error instanceof Error 
        ? `Connection error: ${error.message}` 
        : 'Failed to connect to backend service'
    }, { status: 500 });
  }
}
