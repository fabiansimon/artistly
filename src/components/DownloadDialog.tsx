import { clientDownload } from '@/lib/audioHelpers';
import { getReadableDate } from '@/lib/utils';
import { useProjectContext } from '@/providers/ProjectProvider';
import { Version } from '@/types';
import { useState } from 'react';

export default function DownloadDialog() {
  const [isLoading, setIsLoading] = useState<Set<string>>(new Set<string>());
  const { project } = useProjectContext();

  if (!project) return;
  const { versions, title } = project;

  const updateLoading = (id: string) => {
    setIsLoading((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      return newSet;
    });
  };

  const handleDownload = async (v: Version) => {
    const { title, file_url, id } = v;
    updateLoading(id);
    const name = `${project.title}_${title}`;
    try {
      await clientDownload(name, id, file_url);
    } catch (error) {
      console.error('Error downloading the file:', error);
    } finally {
      updateLoading(id);
    }
  };

  return (
    <div className="flex flex-col w-full items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Download Audio</h3>
        <p className="text-white/70 text-sm text-center -mt-2">{`From project "${title}"`}</p>
      </article>
      {!versions.length && (
        <div className="border rounded-lg p-2 border-white/10">
          <p className="prose text-sm text-white/60">
            No versions updated yet.
          </p>
        </div>
      )}
      <div className="space-y-2 w-full max-h-64 overflow-y-auto">
        {versions.map((version) => {
          const { id, title, created_at } = version;
          return (
            <div
              onClick={() => handleDownload(version)}
              key={id}
              className="flex border cursor-pointer hover:bg-neutral-950 border-white/10 justify-center rounded-md px-2 h-16 items-center "
            >
              {isLoading.has(id) ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <div className="space-y-1 -mb-1 mt-1">
                  <p className="text-white text-sm -mt-2 text-center">
                    {title}
                  </p>
                  <p className="text-white/70 text-xs -mt-2 text-center">
                    {getReadableDate(created_at)}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
