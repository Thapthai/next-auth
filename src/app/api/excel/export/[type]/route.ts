import { NextRequest, NextResponse } from 'next/server';

// สำหรับ development ใช้ localhost, สำหรับ production ใช้ environment variable
const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

export async function POST(
  request: NextRequest,
  { params }: { params: { type: string } }
) {
  try {
    const body = await request.json();
    
    // Forward request to NestJS backend
    const response = await fetch(`${BACKEND_URL}/excel/export/${params.type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // Forward authorization header if exists
        ...(request.headers.get('authorization') && {
          'Authorization': request.headers.get('authorization')!
        })
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: 'Export failed', details: errorText },
        { status: response.status }
      );
    }

    // Get the file content
    const buffer = await response.arrayBuffer();
    
    // Get filename from response headers or use default
    const contentDisposition = response.headers.get('content-disposition');
    let filename = `${params.type}_export.xlsx`;
    
    if (contentDisposition) {
      const matches = /filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/.exec(contentDisposition);
      if (matches != null && matches[1]) {
        filename = matches[1].replace(/['"]/g, '');
      }
    }

    // Return the Excel file
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': buffer.byteLength.toString(),
      },
    });
  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}