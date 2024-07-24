import ModalController from '@/controllers/ModalController';
import { useProjectContext } from '@/providers/ProjectProvider';
import {
  Copy01Icon,
  InformationCircleIcon,
  MagicWand01Icon,
  Sad01Icon,
} from 'hugeicons-react';
import { useMemo, useState } from 'react';
import InviteDialog from './InviteDialog';
import { copyToClipboard } from '@/lib/utils';
import ToastController from '@/controllers/ToastController';
import SimpleButton from './SimpleButton';

export default function ShareDialog() {
  const { project, generateShareable, removeShareable } = useProjectContext();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!project) return;
  const { shareableUrl } = project;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      await generateShareable({
        onlyRecentVersion: true,
        unlimitedVisits: true,
      });
    } catch (error) {
      ToastController.showErrorToast();
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await removeShareable();
    } catch (error) {
      ToastController.showErrorToast();
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvites = () => {
    ModalController.close();
    setTimeout(() => {
      ModalController.show(<InviteDialog />);
    }, 300);
  };

  const handleCopy = () => {
    if (!shareableUrl) return;
    copyToClipboard(shareableUrl);
    ToastController.showSuccessToast(
      'Successfully copied.',
      'Share the link with you friends so they can listen to your project.'
    );
  };

  return (
    <div className="flex flex-col w-full max-w-screen-md items-center space-y-4 -pb-4">
      <article className="prose">
        <h3 className="text-white text-sm text-center">Share Project</h3>
        <p className="text-white-70 text-sm text-center">
          Keep in mind people with access to this link can only listen and
          download this song. To invite collaborators{' '}
          <a
            className="cursor-pointer"
            onClick={handleInvites}
          >
            click here
          </a>
        </p>
      </article>

      {/* Options Container */}
      {!shareableUrl && (
        <div className="flex grow w-full space-x-2 py-2">
          <div className="w-full border border-white/10 rounded-lg p-2 space-y-2 -mb-1">
            <div className="flex space-x-1 justify-center items-center">
              <div
                className="tooltip tooltip-right"
                data-tip="Choose if you only want to share your most recent version or let the user switch between all versions."
              >
                <InformationCircleIcon size={14} />
              </div>
              <p className="text-white text-xs text-center">Versions</p>
            </div>
            <div className="flex -pt-4">
              <div className="form-control -mt-1">
                <label className="label cursor-pointer">
                  <span className="label-text text-xs">All versions</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio size-5 checked:bg-primary ml-2"
                    defaultChecked
                  />
                </label>
              </div>
              <div className="form-control  -mt-1">
                <label className="label cursor-pointer">
                  <span className="label-text text-xs">Only latest</span>
                  <input
                    type="radio"
                    name="radio-10"
                    className="radio size-5 checked:bg-primary ml-2"
                    defaultChecked
                  />
                </label>
              </div>
            </div>
          </div>
          <div className="flex grow w-full space-x-2">
            <div className="w-full border border-white/10 rounded-lg p-2 space-y-2 -mb-1">
              <div className="flex space-x-1 justify-center items-center">
                <div
                  className="tooltip tooltip-left"
                  data-tip="Make the link valid for only a one time visit or unlimited visits."
                >
                  <InformationCircleIcon size={14} />
                </div>
                <p className="text-white text-xs text-center">Validity</p>
              </div>
              <div className="flex -pt-4">
                <div className="form-control -mt-1">
                  <label className="label cursor-pointer">
                    <span className="label-text text-xs">One listen</span>
                    <input
                      type="radio"
                      name="radio-20"
                      className="radio size-5 checked:bg-primary ml-2"
                      defaultChecked
                    />
                  </label>
                </div>
                <div className="form-control -mt-1">
                  <label className="label cursor-pointer">
                    <span className="label-text text-xs">Unlimited</span>
                    <input
                      type="radio"
                      name="radio-20"
                      className="radio size-5 checked:bg-primary ml-2"
                      defaultChecked
                    />
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {/*  */}

      {!shareableUrl && (
        <button
          onClick={handleGenerate}
          className="btn text-white btn-primary h-16 w-full"
        >
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            <>
              <MagicWand01Icon
                className="text-white"
                size={18}
              />
              Generate Link
            </>
          )}
        </button>
      )}

      {shareableUrl && (
        <button
          onClick={handleCopy}
          className="btn text-white btn-primary h-16 w-full"
        >
          <div className="flex flex-col items-center space-y-2">
            <p className="text-white/70 text-[12px] font-normal">
              {shareableUrl}
            </p>
            <div className="flex space-x-[5px] items-center">
              <p className="text-white text-xs">Click to copy</p>
              <Copy01Icon
                className="mr-2 text-white/70"
                size={15}
              />
            </div>
          </div>
        </button>
      )}

      {shareableUrl && (
        <SimpleButton
          onClick={handleRemove}
          className="mx-auto opacity-80 border-error/30 text-error/50"
          text="remove link"
          textClassName="text-error/60"
        />
      )}
    </div>
  );
}
