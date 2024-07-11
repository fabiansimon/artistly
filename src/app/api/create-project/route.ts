import { getUserData } from '../controllers/userController';
import { createInvites } from '../controllers/inviteController';
import { createProject } from '../controllers/projectController';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const form = await req.formData();
    const title = form.get('title') as string;
    const description = form.get('description') as string;
    const invitees = form.get('invitees') as string;

    const emails = await JSON.parse(invitees);
    const project = await createProject({ title, description, userId });

    await createInvites(project.id, emails);

    return NextResponse.json({
      project,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
