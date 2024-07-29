import { NextRequest, NextResponse } from 'next/server';
import { fetchUsersByIds, getUserData } from '../controllers/userController';
import {
  createInvites,
  fetchInvitesByProjectId,
  updateInvites,
} from '../controllers/inviteController';
import { fetchCollaboratorsIdsByProjectId } from '../controllers/collabController';
import { fetchProjectById } from '../controllers/projectController';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get('projectId');

    if (!projectId) {
      return NextResponse.json(
        { error: 'Missing projectId or userId' },
        { status: 400 }
      );
    }

    const { invitees: inviteesRaw } = await req.json();
    const invitees = await JSON.parse(inviteesRaw);

    // Filter emails that are already part of the project eg: Collaborators and/or Authors
    const { creator_id } = await fetchProjectById(projectId);
    const collaboratorsIds = await fetchCollaboratorsIdsByProjectId(projectId);

    const userIds = [creator_id, ...collaboratorsIds];

    const users = await fetchUsersByIds(userIds);
    const usersEmails = users.map((user) => user.email);

    const oldInvites = (await fetchInvitesByProjectId(projectId)) || [];
    const oldEmails = oldInvites.map((i) => i.email) || [];

    const userSet = new Set(usersEmails);
    const oldSet = new Set(oldEmails);
    const newSet = new Set(invitees);

    const newInvites = invitees.filter(
      (email: string) => !userSet.has(email) && !oldSet.has(email)
    );

    const toUpdate = oldInvites
      .filter((invite) => newSet.has(invite.email))
      .map((invite) => invite.id);

    let invites;
    if (newInvites.length > 0) {
      invites = await createInvites(projectId, newInvites);
    }
    if (toUpdate.length > 0) await updateInvites(toUpdate);

    return NextResponse.json({ status: 200, invites });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
