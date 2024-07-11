import { NextRequest, NextResponse } from 'next/server';
import {
  joinCollabProject,
  projectIncludesUser,
} from '../../controllers/collabController';
import { getUserData } from '../../controllers/userController';
import {
  checkValidInvite,
  deleteInvite,
  inviteExpired,
} from '../../controllers/inviteController';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, email } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: projectId } = params;
    if (!projectId)
      return NextResponse.json(
        { error: 'Project ID is required.' },
        { status: 400 }
      );

    const invite = await checkValidInvite(projectId, email);

    if (!invite)
      return NextResponse.json({ error: 'No invite found.' }, { status: 400 });

    /* Check if invite is valid */
    const { created_at, id } = invite;
    if (inviteExpired(created_at)) {
      await deleteInvite(id);
      return NextResponse.json({ error: 'Invite is expired' }, { status: 410 });
    }

    const exists = await projectIncludesUser(projectId, userId);
    if (exists) {
      await deleteInvite(id);
      return NextResponse.json({ status: 204 });
    }

    await joinCollabProject(projectId, userId);
    await deleteInvite(id);

    return NextResponse.json({ status: 200 });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
