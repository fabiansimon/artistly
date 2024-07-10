import { NextRequest, NextResponse } from 'next/server';
import {
  joinCollabProject,
  projectIncludesUser,
} from '../../controllers/collabController';
import { getUserId } from '../../controllers/authController';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = params;
    if (!projectId)
      return NextResponse.json(
        { error: 'Project ID is required.' },
        { status: 400 }
      );

    const exists = await projectIncludesUser(projectId, userId);
    if (exists) return NextResponse.json({ status: 204 });

    await joinCollabProject(projectId, userId);

    return NextResponse.json({ status: 204 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
