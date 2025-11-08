import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    // TODO: Fetch employee salary schemes from database with search
    const mockData = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        employeeNik: '1234567890',
        schemeId: 'SCH001',
        schemeName: 'Staff Level 1',
        effectiveDate: '2025-01-01',
        basicSalary: 5000000,
        totalAllowances: 1500000,
        isActive: true,
      },
      {
        id: '2',
        employeeId: 'EMP002',
        employeeName: 'Jane Smith',
        employeeNik: '0987654321',
        schemeId: 'SCH002',
        schemeName: 'Staff Level 2',
        effectiveDate: '2025-01-01',
        basicSalary: 7000000,
        totalAllowances: 2250000,
        isActive: true,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching employee schemes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { employeeId, schemeId, effectiveDate } = body;

    // TODO: Assign salary scheme to employee in database
    
    return NextResponse.json({
      success: true,
      message: 'Employee scheme assigned successfully',
      data: { employeeId, schemeId, effectiveDate },
    });
  } catch (error) {
    console.error('Error assigning employee scheme:', error);
    return NextResponse.json(
      { error: 'Failed to assign scheme' },
      { status: 500 }
    );
  }
}

