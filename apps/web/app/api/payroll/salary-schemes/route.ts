import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // TODO: Fetch salary schemes from database
    const mockData = [
      {
        id: '1',
        code: 'STF-01',
        name: 'Staff Level 1',
        basicSalary: 5000000,
        components: [
          { componentId: '1', componentName: 'Tunjangan Transportasi', amount: 500000 },
          { componentId: '2', componentName: 'Tunjangan Makan', amount: 1000000 },
        ],
        isActive: true,
      },
      {
        id: '2',
        code: 'STF-02',
        name: 'Staff Level 2',
        basicSalary: 7000000,
        components: [
          { componentId: '1', componentName: 'Tunjangan Transportasi', amount: 750000 },
          { componentId: '2', componentName: 'Tunjangan Makan', amount: 1500000 },
        ],
        isActive: true,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching salary schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, basicSalary } = body;

    // TODO: Insert salary scheme into database
    
    return NextResponse.json({
      success: true,
      message: 'Scheme saved successfully',
      data: { code, name, basicSalary },
    });
  } catch (error) {
    console.error('Error saving salary scheme:', error);
    return NextResponse.json(
      { error: 'Failed to save scheme' },
      { status: 500 }
    );
  }
}

