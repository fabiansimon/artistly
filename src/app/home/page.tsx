'use client';

import Container from '@/components/Container';
import { Rocket01Icon } from 'hugeicons-react';

export default function HomePage() {
  return (
    <Container onRefresh={() => console.log('hello')}>
      <div className="flex space-x-2 items-center mb-2">
        <Rocket01Icon size={18} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Latest Feedback'}</h3>
        </article>
      </div>
      {/* <div className="">
        {collabs.length == 0 && (
          <p className="text-sm text-white/50">No projects found.</p>
        )}
        {collabs.map((collab) => (
          <ProjectTile
            onClick={() => router.push(route(ROUTES.project, collab.id))}
            key={collab.id}
            project={collab}
          />
        ))}
      </div>
      <div className="flex space-x-2 items-center mb-2 mt-4">
        <MusicNote01Icon size={18} />
        <article className="prose">
          <h3 className="text-[18px] text-white">{'Authored'}</h3>
        </article>
      </div>
      <div className="">
        {authored.length == 0 && (
          <p className="text-sm text-white/50">No projects found.</p>
        )}
        {authored.map((collab) => (
          <ProjectTile
            onClick={() => router.push(route(ROUTES.project, collab.id))}
            key={collab.id}
            project={collab}
          />
        ))}
      </div> */}
    </Container>
  );
}
