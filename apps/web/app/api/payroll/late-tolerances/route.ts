import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Fetch late tolerance rules from database
    const mockData = [
      {
        id: '1',
        name: 'Late 1-15 minutes',
        minMinutes: 1,
        maxMinutes: 15,
        deductionType: 'fixed' as const,
        deductionAmount: 50000,
        isActive: true,
      },
      {
        id: '2',
        name: 'Late 16-30 minutes',
        minMinutes: 16,
        maxMinutes: 30,
        deductionType: 'fixed' as const,
        deductionAmount: 100000,
        isActive: true,
      },
      {
        id: '3',
        name: 'Late 31-60 minutes',
        minMinutes: 31,
        maxMinutes: 60,
        deductionType: 'percentage' as const,
        deductionAmount: 10,
        isActive: true,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching late tolerances:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, minMinutes, maxMinutes, deductionType, deductionAmount } = body;

    // TODO: Insert late tolerance rule into database
    
    return NextResponse.json({
      success: true,
      message: 'Tolerance rule saved successfully',
      data: body,
    });
  } catch (error) {
    console.error('Error saving late tolerance:', error);
    return NextResponse.json(
      { error: 'Failed to save tolerance' },
      { status: 500 }
    );
  }
}

