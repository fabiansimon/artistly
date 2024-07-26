import { NextRequest, NextResponse } from 'next/server';
import {
  archiveShareable,
  deleteShareable,
  fetchShareableById,
  generateShareableURL,
  incrementOpenedCount,
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

    const {
      id: shareableId,
      created_at,
      project_id,
      only_recent_version,
      unlimited_visits,
      archived,
    } = await fetchShareableById(id);

    if (archived) {
      return NextResponse.json(
        { error: 'This link is expired and not valid.' },
        { status: 410 }
      );
    }

    const project = await fetchProjectById(project_id);
    const versions = await fetchVersionsByProjectId(project_id);
    const opened = await incrementOpenedCount(id);

    if (!unlimited_visits) await archiveShareable(id);

    const res: ShareableProject = {
      id: shareableId,
      url: generateShareableURL(shareableId),
      title: project.title,
      created_at,
      versions: only_recent_version ? versions.slice(0, 1) : versions,
      only_recent_version,
      unlimited_visits,
      project_id,
      opened,
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
