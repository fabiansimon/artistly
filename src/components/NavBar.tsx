import { IcoIcon, PlayIcon, PresentationBarChart01Icon } from 'hugeicons-react';
import { useMemo } from 'react';

function NavBar(): JSX.Element {
  const linkData = useMemo(() => {
    return [
      {
        title: 'Upload',
        icon: <PlayIcon />,
      },
      {
        title: 'Leaderboard',
        icon: <PresentationBarChart01Icon />,
      },
      {
        title: 'Create',
        icon: <IcoIcon />,
      },
    ];
  }, []);

  return (
    <nav className="bg-neutral-900/50 left-0 right-0 top-0 z-20 h-20 backdrop-blur-sm justify-center items-center fixed"></nav>
  );
}

export default NavBar;
