import { NextRequest, NextResponse } from 'next/server';
import {
  deleteFeedback,
  fetchFeedbackById,
} from '../../../controllers/feedbackController';
import { getUserData } from '@/app/api/controllers/userController';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { userId } = await getUserData(req);
    const { creator_id } = await fetchFeedbackById(id);

    if (!userId || userId !== creator_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteFeedback(id);

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
