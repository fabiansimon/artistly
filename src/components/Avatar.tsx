import { cn } from '@/lib/utils';

export default function Avatar({ className }: { className?: string }) {
  return (
    <div className="avatar">
      <div className={cn('mask mask-squircle size-6', className)}>
        <img
          src="https://img.daisyui.com/tailwind-css-component-profile-2@56w.png"
          alt="Avatar Tailwind CSS Component"
        />
      </div>
    </div>
  );
}
