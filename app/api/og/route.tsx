import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || 'City';
  const state = searchParams.get('state') || 'State';

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 60,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontWeight: 'bold',
          textAlign: 'center',
          padding: '40px',
        }}
      >
        <div style={{ fontSize: 48, marginBottom: 20 }}>
          Certified Installers
        </div>
        <div style={{ fontSize: 72, marginBottom: 10 }}>
          {city}
        </div>
        <div style={{ fontSize: 36, opacity: 0.9 }}>
          Network Cabling Technician in {city}, {state}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}

