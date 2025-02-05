import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) {
      throw new Error('NEXT_PUBLIC_BACKEND_URL environment variable is not defined');
    }
    
    const fullUrl = `${backendUrl}/data`;
    console.log('Connecting to backend at:', fullUrl);
    
    const response = await fetch(fullUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Backend error:', {
        status: response.status,
        statusText: response.statusText,
      });
      throw new Error(`Backend responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('API route error:', error);
    
    let errorMessage = 'Internal server error';
    if (error instanceof TypeError && error.message.includes('URL')) {
      errorMessage = 'Backend URL configuration error';
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      {
        success: false,
        data: null,
        error: `Backend connection error: ${errorMessage}`,
      },
      { status: 500 }
    );
  }
}
