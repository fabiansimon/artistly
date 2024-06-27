import { createFeedback } from '../controllers/feedbackController';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { versionId, text, timestamp } = await req.json();

    const feedback = await createFeedback({
      creatorId: 'f6ad275a-f4f0-4ff5-8729-de8a99a4be5d',
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
