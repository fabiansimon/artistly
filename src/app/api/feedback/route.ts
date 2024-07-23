import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../controllers/userController';
import { createFeedback } from '../controllers/feedbackController';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { versionId, text, timestamp, projectId } = await req.json();

    const feedback = await createFeedback({
      creatorId: userId,
      text,
      versionId,
      timestamp,
      projectId,
    });

    return NextResponse.json(feedback);
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
