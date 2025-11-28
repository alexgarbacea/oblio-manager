import { NextRequest, NextResponse } from 'next/server';
import { decryptToken } from '@/lib/crypto';

const OBLIO_BASE_URL = 'https://www.oblio.eu/api';

export async function GET(request: NextRequest) {
  return handleRequest(request, 'GET');
}

export async function POST(request: NextRequest) {
  return handleRequest(request, 'POST');
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, 'PUT');
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, 'DELETE');
}

async function handleRequest(request: NextRequest, method: string) {
  try {
    const encryptedToken = request.headers.get('x-encrypted-token');
    const endpoint = request.headers.get('x-oblio-endpoint');

    if (!encryptedToken || !endpoint) {
      return NextResponse.json(
        { error: 'Missing required headers' },
        { status: 400 }
      );
    }

    const token = decryptToken(encryptedToken);
    const url = `${OBLIO_BASE_URL}${endpoint}`;

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };

    const options: RequestInit = {
      method,
      headers,
    };

    if (method !== 'GET' && method !== 'DELETE') {
      const body = await request.json();
      options.body = JSON.stringify(body.data);
    }

    const response = await fetch(url, options);
    const data = await response.json();

    return NextResponse.json({
      response: data,
      request: method !== 'GET' && method !== 'DELETE' ? JSON.parse(options.body as string) : null,
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
