import { NextRequest, NextResponse } from 'next/server';
import { fetchAuthorProjects } from '../controllers/projectController';
import { convertPaginationParam } from '@/lib/utils';
import { fetchCollabProjects } from '../controllers/collabController';

export async function GET(request: NextRequest) {
  const userId = '4f0f6512-2b24-4d15-a058-8af776af0409';
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
