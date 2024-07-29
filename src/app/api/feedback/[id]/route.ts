import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../../controllers/userController';
import {
  deleteFeedback,
  fetchFeedbackById,
} from '../../controllers/feedbackController';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing project ID' },
        { status: 400 }
      );
    }
    const { userId } = await getUserData(req);
    const { creator_id } = await fetchFeedbackById(id);

    if (!userId || userId !== creator_id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await deleteFeedback(id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
