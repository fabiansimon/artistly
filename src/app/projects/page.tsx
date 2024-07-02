'use client';

import { getUserProjects } from '@/lib/api';
import { useEffect } from 'react';

export default function ProjectsListPage() {
  useEffect(() => {
    (async () => {
      const res = await getUserProjects({ pagination: { limit: 10, page: 1 } });
      console.log(res);
    })();
  }, []);

  return (
    <div className="flex items-center flex-grow h-full w-full flex-col fixed py-10">
      <div className="flex items-center w-full space-x-6 px-10 mt-4 justify-center">
        Hello Sir
      </div>
    </div>
  );
}
