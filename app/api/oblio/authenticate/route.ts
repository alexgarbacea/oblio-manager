import { NextRequest, NextResponse } from 'next/server';
import { decryptCredentials } from '@/lib/crypto';

const OBLIO_BASE_URL = 'https://www.oblio.eu/api';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { encryptedCredentials } = body;

    if (!encryptedCredentials) {
      return NextResponse.json(
        { error: 'Missing credentials' },
        { status: 400 }
      );
    }

    const credentials = decryptCredentials(encryptedCredentials);

    const response = await fetch(`${OBLIO_BASE_URL}/authorize/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: credentials.clientId,
        client_secret: credentials.clientSecret,
      }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Authentication failed' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Authentication error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
