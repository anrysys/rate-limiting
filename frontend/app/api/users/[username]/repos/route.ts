import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/users/${params.username}/repos`
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch repositories');
    }

    return NextResponse.json({
      success: true,
      data: data,
      error: null
    });
    
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      data: null,
      error: error.message
    }, { status: 500 });
  }
}
