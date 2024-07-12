import { NextRequest, NextResponse } from 'next/server';
import { fetchAuthorProjects } from '../controllers/projectController';
import { convertPaginationParam } from '@/lib/utils';
import { fetchCollabProjects } from '../controllers/collabController';
import { getUserData } from '../controllers/userController';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const pagination = convertPaginationParam(req.nextUrl.searchParams);
    const collabProjects = await fetchCollabProjects(userId, pagination);
    const authorProjects = await fetchAuthorProjects(userId, pagination);

    const data = {
      content: {
        collabs: collabProjects,
        authored: authorProjects,
      },
      totalElements: authorProjects.length + collabProjects.length,
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
