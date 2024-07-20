import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../controllers/userController';
import { deleteInvite } from '../controllers/inviteController';
import { fetchProjectById } from '../controllers/projectController';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId or userId' },
        { status: 400 }
      );
    }

    const { creator_id } = await fetchProjectById(projectId);
    if (!userId || creator_id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { inviteId } = await req.json();

    await deleteInvite(inviteId);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
