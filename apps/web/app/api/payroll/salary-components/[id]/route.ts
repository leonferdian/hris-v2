import { NextRequest, NextResponse } from 'next/server';
import { deleteSalaryComponent } from '@/lib/db/payroll';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    if (!id) {
      return NextResponse.json(
        { error: 'Component ID is required' },
        { status: 400 }
      );
    }

    // Delete salary component from database
    await deleteSalaryComponent(id);
    
    return NextResponse.json({
      success: true,
      message: 'Component deleted successfully',
      id,
    });
  } catch (error) {
    console.error('Error deleting salary component:', error);
    return NextResponse.json(
      { error: 'Failed to delete component', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

