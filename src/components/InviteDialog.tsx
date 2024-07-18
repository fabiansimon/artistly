import { useMemo, useState } from 'react';
import { Mail01Icon, MehIcon, TimeScheduleIcon } from 'hugeicons-react';
import { REGEX } from '@/constants/regex';
import ToastController from '@/controllers/ToastController';
import DialogController from '@/controllers/DialogController';
import CollaboratorChip from './CollaboratorChip';
import { sendInvites } from '@/lib/api';
import { Project } from '@/types';

export default function InviteDialog({
  project: { id: projectId, openInvites },
}: {
  project: Project;
}) {
  const [loading, setLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>('');
  const [emails, setEmails] = useState<Set<string>>(new Set<string>());

  const inputValid = useMemo(() => emails.size > 0, [emails]);

  const handleSubmit = async () => {
    if (!inputValid) return;
    setLoading(true);

    const invitees = JSON.stringify(Array.from(emails));

    try {
      await sendInvites(projectId, invitees);
      ToastController.showSuccessToast(
        'Invites were sent out.',
        'They will expire in 30 days.'
      );
    } catch (error) {
      console.log(error);
      ToastController.showErrorToast();
    } finally {
      DialogController.closeDialog();
      setLoading(false);
    }
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => {
      const list = new Set(prev);
      list.delete(email);
      return list;
    });
  };

  const addEmail = () => {
    const email = input.trim();
    if (!REGEX.email.test(email)) {
      return ToastController.showErrorToast(
        'Not a valid email',
        'Try again with a valid email.'
      );
    }

    setInput('');
    setEmails((prev) => {
      const newEmails = new Set(prev);
      newEmails.add(email);
      return newEmails;
    });
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center">
      <article className="prose mb-4">
        <h3 className="text-white text-sm text-center">Invite Collaborators</h3>
      </article>
      <div className="flex flex-grow flex-col justify-center rounded-xl items-center space-y-4 w-full">
        <div className="w-full flex flex-col space-y-1">
          <article className="prose text-left text-white">
            <p className="text-white/80 text-sm">{'Collaborators'}</p>
          </article>
          {emails.size > 0 ? (
            <div className="flex flex-wrap gap-2">
              {Array.from(emails).map((email, index) => (
                <CollaboratorChip
                  key={index}
                  email={email}
                  onDelete={() => removeEmail(email)}
                />
              ))}
            </div>
          ) : (
            <div className="flex items-center space-x-[5.5px]">
              <MehIcon
                size={14}
                className="text-white/40"
              />
              <article>
                <p className="prose-sm text-white/40 ">no one added yet</p>
              </article>
            </div>
          )}
        </div>
        <div className="flex gap-4 w-full flex-col md:flex-row">
          <label className="input input-bordered bg-transparent flex items-center gap-2 flex-grow">
            <Mail01Icon size={16} />
            <input
              onInput={({ currentTarget: { value } }) => setInput(value)}
              value={input}
              type="text"
              className="grow text-sm bg-transparent"
              placeholder="Email"
            />
          </label>
          <button
            disabled={input.trim().length === 0}
            onClick={addEmail}
            className="btn btn-outline btn-primary text-white flex-grow"
          >
            {'Add'}
          </button>
        </div>
      </div>
      <button
        disabled={!inputValid}
        onClick={handleSubmit}
        className="btn btn-active btn-primary text-white mt-4 w-full"
      >
        {loading ? (
          <span className="loading loading-spinner"></span>
        ) : (
          <article className="prose text-white">
            <p>{'Send invites'}</p>
          </article>
        )}
      </button>
      <div className="border border-white/10 rounded-lg p-2 mt-4 flex justify-center flex-col items-center">
        <div className="flex items-center space-x-2">
          <TimeScheduleIcon size={12} />
          <p className="prose text-white/70 text-xs font-medium text-center">
            Outstanding invites
          </p>
        </div>
        <div className="divider my-0" />
        <div className="flex flex-wrap justify-center gap-2">
          {openInvites.map(({ email, id }) => (
            <CollaboratorChip
              key={id}
              email={email}
              onDelete={() =>
                DialogController.showDialog('Remove invitation?', '', () =>
                  console.log('hdll')
                )
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
