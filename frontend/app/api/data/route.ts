import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const response = await fetch('http://localhost:5111/api/data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    return NextResponse.json({
      success: true,
      data,
      error: null
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      data: null,
      error: 'Failed to process data'
    }, { status: 500 });
  }
}
