import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../controllers/userController';
import { fetchAuthorProjects } from '../controllers/projectController';
import { fetchLatestFeedbackByProjectIds } from '../controllers/feedbackController';
import { InitSummary } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await fetchAuthorProjects(userId);
    const projectIds = projects.map((p) => p.id);
    const lastestFeedback = await fetchLatestFeedbackByProjectIds(projectIds);

    const data: InitSummary = {
      latestFeedback: projects,
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
