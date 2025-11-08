import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const period = searchParams.get('period');

    if (!period) {
      return NextResponse.json([]);
    }

    // TODO: Fetch payroll report grouped by depot from database
    const mockData = [
      {
        depoId: 'DPO001',
        depoName: 'Jakarta Pusat',
        depoLocation: 'Jakarta',
        employeeCount: 25,
        totalBasicSalary: 125000000,
        totalAllowances: 37500000,
        totalDeductions: 12500000,
        netPayroll: 150000000,
      },
      {
        depoId: 'DPO002',
        depoName: 'Surabaya Timur',
        depoLocation: 'Surabaya',
        employeeCount: 18,
        totalBasicSalary: 90000000,
        totalAllowances: 27000000,
        totalDeductions: 9000000,
        netPayroll: 108000000,
      },
      {
        depoId: 'DPO003',
        depoName: 'Bandung Selatan',
        depoLocation: 'Bandung',
        employeeCount: 15,
        totalBasicSalary: 75000000,
        totalAllowances: 22500000,
        totalDeductions: 7500000,
        netPayroll: 90000000,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching report by depo:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

