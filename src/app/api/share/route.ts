import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../controllers/userController';
import {
  createShareable,
  generateShareableURL,
} from '../controllers/shareController';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { onlyRecentVersion, unlimitedVisits, projectId } = await req.json();

    const { id } = await createShareable({
      projectId,
      onlyRecentVersion,
      unlimitedVisits,
    });

    const url = generateShareableURL(id);

    return NextResponse.json({ url });
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
