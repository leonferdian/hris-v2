import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Fetch payroll periods from database
    const mockData = [
      {
        id: '1',
        name: 'January 2025',
        startDate: '2025-01-01',
        endDate: '2025-01-31',
        paymentDate: '2025-02-05',
        cutoffDate: '2025-01-25',
        status: 'active' as const,
      },
      {
        id: '2',
        name: 'December 2024',
        startDate: '2024-12-01',
        endDate: '2024-12-31',
        paymentDate: '2025-01-05',
        cutoffDate: '2024-12-25',
        status: 'closed' as const,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching periods:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, startDate, endDate, paymentDate, cutoffDate } = body;

    // TODO: Insert payroll period into database
    
    return NextResponse.json({
      success: true,
      message: 'Period saved successfully',
      data: { name, startDate, endDate, paymentDate, cutoffDate },
    });
  } catch (error) {
    console.error('Error saving period:', error);
    return NextResponse.json(
      { error: 'Failed to save period' },
      { status: 500 }
    );
  }
}

