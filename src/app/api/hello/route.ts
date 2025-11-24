import { NextRequest, NextResponse } from 'next/server';

// This is a Next.js API route (alternative to Express routes)
// Note: When using custom Express server, Express routes take precedence
// This route won't be hit if Express has a matching route at /api/hello

export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    message: 'Hello from Next.js API route!',
    note: 'This is the Next.js built-in API route handler'
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name } = body;
    
    return NextResponse.json({ 
      message: `Hello ${name || 'Guest'} from Next.js API route!`,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json({ 
      error: 'Invalid request body' 
    }, { status: 400 });
  }
}

