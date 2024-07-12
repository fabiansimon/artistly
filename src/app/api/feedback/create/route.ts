import { NextRequest, NextResponse } from 'next/server';
import { createFeedback } from '../../controllers/feedbackController';
import { getUserData } from '../../controllers/userController';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { versionId, text, timestamp } = await req.json();

    const feedback = await createFeedback({
      creatorId: userId,
      text,
      versionId,
      timestamp,
    });

    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
