import { NextRequest, NextResponse } from 'next/server';
import { deleteFeedback } from '../../../controllers/feedbackController';

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    await deleteFeedback(id);

    return NextResponse.json({ status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
