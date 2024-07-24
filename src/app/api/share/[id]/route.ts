import { NextRequest, NextResponse } from 'next/server';
import {
  deleteShareable,
  fetchShareableByID,
} from '../../controllers/shareController';
import { fetchProjectById } from '../../controllers/projectController';
import { fetchVersionsByProjectId } from '../../controllers/versionController';
import { ShareableProject } from '@/types';

export async function GET(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing shareable ID' },
        { status: 400 }
      );
    }

    const { project_id, only_recent_version, unlimited_visits } =
      await fetchShareableByID(id);
    const project = await fetchProjectById(project_id);
    const versions = await fetchVersionsByProjectId(project_id);

    if (!unlimited_visits) await deleteShareable(id);

    const res: ShareableProject = {
      title: project.title,
      versions: only_recent_version ? versions.slice(0, 1) : versions,
      only_recent_version,
      unlimited_visits,
    };

    return NextResponse.json(res);
  } catch (error) {
    console.error('Error fetching shareable project data:', error);
    return NextResponse.json(
      {
        error: 'Internal Server Error: Unable to fetch shareable project data',
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'Bad Request: Missing shareable ID' },
        { status: 400 }
      );
    }

    await deleteShareable(id);

    return NextResponse.json(
      { message: 'Shareable successfully deleted' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting shareable:', error);
    return NextResponse.json(
      { error: 'Internal Server Error: Unable to delete shareable' },
      { status: 500 }
    );
  }
}
