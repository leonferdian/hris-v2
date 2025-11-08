import { NextRequest, NextResponse } from 'next/server';
import { getSalaryComponents, createSalaryComponent } from '@/lib/db/payroll';

export async function GET() {
  try {
    // Fetch salary components from SQL Server database
    const components = await getSalaryComponents(true); // Get only active components
    
    return NextResponse.json(components);
  } catch (error) {
    console.error('Error fetching salary components:', error);
    return NextResponse.json(
      { error: 'Failed to fetch data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code, name, type, description } = body;

    // Validate required fields
    if (!code || !name || !type) {
      return NextResponse.json(
        { error: 'Missing required fields: code, name, type' },
        { status: 400 }
      );
    }

    // Validate type
    if (type !== 'allowance' && type !== 'deduction') {
      return NextResponse.json(
        { error: 'Type must be either "allowance" or "deduction"' },
        { status: 400 }
      );
    }

    // Insert salary component into database
    const result = await createSalaryComponent({ code, name, type, description });
    
    return NextResponse.json({
      success: true,
      message: 'Component saved successfully',
      data: result,
    });
  } catch (error) {
    console.error('Error saving salary component:', error);
    return NextResponse.json(
      { error: 'Failed to save component', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

