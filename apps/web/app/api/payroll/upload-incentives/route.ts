import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const period = formData.get('period') as string;

    if (!file || !period) {
      return NextResponse.json(
        { error: 'File and period are required' },
        { status: 400 }
      );
    }

    // TODO: Parse Excel/CSV file
    // TODO: Validate employee NIKs
    // TODO: Insert incentive records into database

    // Mock upload results
    const mockResults = [
      {
        employeeNik: 'EMP001',
        employeeName: 'John Doe',
        amount: 1000000,
        status: 'success' as const,
        message: 'Incentive uploaded successfully',
      },
      {
        employeeNik: 'EMP002',
        employeeName: 'Jane Smith',
        amount: 1500000,
        status: 'success' as const,
        message: 'Incentive uploaded successfully',
      },
    ];

    return NextResponse.json({
      success: true,
      message: 'Upload completed',
      results: mockResults,
    });
  } catch (error) {
    console.error('Error uploading incentives:', error);
    return NextResponse.json(
      { error: 'Failed to upload incentives' },
      { status: 500 }
    );
  }
}

