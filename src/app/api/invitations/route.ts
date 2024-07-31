import { NextRequest, NextResponse } from 'next/server';
import { fetchUsersByIds, getUserData } from '../controllers/userController';
import { fetchInvitesByEmail } from '../controllers/inviteController';
import { fetchProjectsByIds } from '../controllers/projectController';
import { AUTOMATIC_FONT_OPTIMIZATION_MANIFEST } from 'next/dist/shared/lib/constants';
import { Invitation } from '@/types';

export async function GET(req: NextRequest) {
  try {
    const { userId, email } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const invites = await fetchInvitesByEmail(email);
    if (!invites) return NextResponse.json([]);

    const projects = await fetchProjectsByIds(invites.map((i) => i.project_id));
    const authors = await fetchUsersByIds(projects.map((p) => p.creator_id));

    const res: Invitation[] = [];
    for (const invite of invites) {
      const project = projects.find((p) => p.id === invite.project_id);
      res.push({
        invite,
        project: {
          ...project,
          author: authors.find((a) => a.id === project.creator_id),
        },
      });
    }

    return NextResponse.json(Array(10).fill(res).flat());
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
