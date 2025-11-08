import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period');

    // TODO: Fetch payroll realization data from database
    // This is mock data for demonstration
    const mockData = [
      {
        id: '1',
        employeeId: 'EMP001',
        employeeName: 'John Doe',
        period: period || '2025-01',
        basicSalary: 5000000,
        allowances: 1500000,
        overtime: 500000,
        incentives: 1000000,
        deductions: 500000,
        netSalary: 7500000,
        status: 'pending' as const,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching payroll realization:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

