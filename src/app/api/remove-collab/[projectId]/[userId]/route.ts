import { removeCollaboration } from '@/app/api/controllers/collabController';
import { deleteFeedbackByUserIdInProject } from '@/app/api/controllers/feedbackController';
import { fetchProjectById } from '@/app/api/controllers/projectController';
import { getUserData } from '@/app/api/controllers/userController';
import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  req: NextRequest,
  { params }: { params: { projectId: string; userId: string } }
) {
  try {
    const { userId } = await getUserData(req);
    const { projectId, userId: collaboratorId } = params;

    if (!projectId) {
      return NextResponse.json({ error: 'Missing projectId' }, { status: 400 });
    }

    const { creator_id } = await fetchProjectById(projectId);
    if (!userId || creator_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await Promise.all([
      removeCollaboration(projectId, collaboratorId),
      deleteFeedbackByUserIdInProject({
        userId: collaboratorId,
        projectId,
      }),
    ]);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
