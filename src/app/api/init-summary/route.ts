import { NextRequest, NextResponse } from 'next/server';
import { fetchUsersByIds, getUserData } from '../controllers/userController';
import { fetchAuthorProjects } from '../controllers/projectController';
import { fetchLatestFeedbackByProjectIds } from '../controllers/feedbackController';
import { InitSummary, Project } from '@/types';
import {
  fetchShareablesByProjectIds,
  generateShareableURL,
} from '../controllers/shareController';

export async function GET(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const projects = await fetchAuthorProjects(userId);
    const projectMap = new Map<string, Project>();
    let projectIds: string[] = [];
    for (const project of projects) {
      const { id } = project;
      projectMap.set(id, project);
      projectIds.push(project.id);
    }

    const latestFeedback = await fetchLatestFeedbackByProjectIds(projectIds);

    const feedbackUsers = Array.from(latestFeedback.values()).map(
      (feedback) => feedback.creator_id
    );
    const users = await fetchUsersByIds(feedbackUsers);

    const unsortedFeedback = projects.map((project) => {
      const feedback = latestFeedback.get(project.id);
      const creator = users.find(({ id }) => id === feedback?.creator_id);
      return {
        ...project,
        feedback: {
          ...feedback,
          creator,
        },
      };
    });

    const sortedFeedback = unsortedFeedback.sort((a, b) => {
      return (
        new Date(b.feedback.created_at).getTime() -
        new Date(a.feedback.created_at).getTime()
      );
    });

    const sharedProjects =
      (await fetchShareablesByProjectIds(projectIds)) || [];

    const data: InitSummary = {
      latestFeedback: sortedFeedback,
      sharedProjects: sharedProjects.map((project) => ({
        ...project,
        url: generateShareableURL(project.id),
        title: projectMap.get(project.project_id)?.title,
      })),
    };

    return NextResponse.json(data);
  } catch (error: unknown) {
    console.log(error);
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
