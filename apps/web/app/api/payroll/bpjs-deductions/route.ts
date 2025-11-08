import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';

    // TODO: Fetch employee BPJS deductions from database with search
    const mockData = [
      {
        id: '1',
        employeeNik: '1234567890',
        employeeName: 'John Doe',
        bpjsKesehatanNumber: '0001234567890',
        bpjsKesehatanAmount: 100000,
        bpjsKetenagakerjaanNumber: '0009876543210',
        bpjsKetenagakerjaanAmount: 150000,
        totalDeduction: 250000,
        isActive: true,
      },
      {
        id: '2',
        employeeNik: '0987654321',
        employeeName: 'Jane Smith',
        bpjsKesehatanNumber: '0001234567891',
        bpjsKesehatanAmount: 120000,
        bpjsKetenagakerjaanNumber: '0009876543211',
        bpjsKetenagakerjaanAmount: 180000,
        totalDeduction: 300000,
        isActive: true,
      },
    ];

    return NextResponse.json(mockData);
  } catch (error) {
    console.error('Error fetching BPJS deductions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      employeeId,
      bpjsKesehatanNumber,
      bpjsKesehatanAmount,
      bpjsKetenagakerjaanNumber,
      bpjsKetenagakerjaanAmount,
    } = body;

    // TODO: Insert/Update BPJS deduction in database
    
    return NextResponse.json({
      success: true,
      message: 'BPJS deduction saved successfully',
      data: body,
    });
  } catch (error) {
    console.error('Error saving BPJS deduction:', error);
    return NextResponse.json(
      { error: 'Failed to save BPJS deduction' },
      { status: 500 }
    );
  }
}

