import ModalController from '@/controllers/ModalController';
import { MenuOption } from '@/types';
import { Add01Icon } from 'hugeicons-react';
import UploadContainer from './UploadContainer';

export default function FloatingBar() {
  const options: MenuOption[] = [
    {
      icon: (
        <Add01Icon
          className="text-white"
          size={18}
        />
      ),
      onClick: () => ModalController.show(<UploadContainer />),
    },
  ];
  return (
    <div className="absolute cursor-pointer flex items-center justify-center bottom-28 right-6 h-10 w-10 bg-primary rounded-full">
      {options.map(({ icon, onClick }, index) => (
        <div
          onClick={onClick}
          key={index}
        >
          {icon}
        </div>
      ))}
    </div>
  );
}
