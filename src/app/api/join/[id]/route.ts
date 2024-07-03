import { NextRequest, NextResponse } from 'next/server';
import {
  joinCollabProject,
  projectIncludesUser,
} from '../../controllers/projectController';

export async function POST(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id: projectId } = params;
    const userId = 'd52d5b96-142c-4837-a462-1f8b9e2e9d55';

    if (!projectId || !userId)
      return NextResponse.json(
        { error: 'Project ID and User ID are required.' },
        { status: 400 }
      );

    const exists = await projectIncludesUser(projectId, userId);

    if (exists)
      return NextResponse.json(
        { error: 'User already added.' },
        { status: 400 }
      );

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
