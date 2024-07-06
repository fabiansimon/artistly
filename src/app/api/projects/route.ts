import { NextRequest, NextResponse } from 'next/server';
import {
  fetchAuthorProjects,
  fetchCollabProjects,
} from '../controllers/projectController';
import { convertPaginationParam } from '@/lib/utils';

export async function GET(request: NextRequest) {
  const userId = 'd52d5b96-142c-4837-a462-1f8b9e2e9d55';
  const pagination = convertPaginationParam(request.nextUrl.searchParams);

  try {
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
