'use client';

import Avatar from '@/components/Avatar';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import MembershipCarousel from '@/components/MembershipCarousel';
import PremiumDialog from '@/components/PremiumDialog';
import SimpleButton from '@/components/SimpleButton';
import DialogController from '@/controllers/DialogController';
import { concatName } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { useUserContext } from '@/providers/UserProvider';
import {
  ArrowLeft02Icon,
  Rocket01Icon,
  Sad01Icon,
  UserAccountIcon,
} from 'hugeicons-react';

export default function ProfilePage() {
  const { user } = useUserContext();
  const {
    projects: { data, fetch, isLoading },
  } = useDataLayerContext();

  if (isLoading || !data)
    return (
      <LoadingView
        strings={['Fetching profile information', 'Searching for projects']}
      />
    );

  const { first_name, last_name, email, image_url, membership } = user;
  return (
    <Container onRefresh={fetch}>
      <div className="flex space-x-2 items-center mb-2">
        <UserAccountIcon size={18} />
        <article className="prose">
          <h3 className="text-[18px] text-white">Profile</h3>
        </article>
      </div>
      <div className="flex items-center flex-col space-y-2">
        <Avatar
          size={40}
          src={image_url}
        />
        <article className="prose text-center pt-2">
          <h3 className="text-[18px] text-white">
            {concatName(first_name, last_name)}
          </h3>
          <p className="text-sm -mt-2 text-white/60">{email}</p>
        </article>
      </div>
      <SimpleButton
        className="mx-auto mt-4"
        text="Log out"
        iconPosition="left"
        icon={<ArrowLeft02Icon size={16} />}
      />

      <div className="divider" />
      <div className="items-center flex flex-col">
        <div className="flex space-x-2 items-center">
          <Rocket01Icon size={16} />
          <h3 className="text-[18px] text-white font-medium">Membership</h3>
        </div>
        <p className="text-sm text-white/60 mt-2">
          Thank you for considering upgrading and supporting us.
        </p>

        <MembershipCarousel
          onClick={(membership) =>
            DialogController.showCustomDialog(
              <PremiumDialog preselected={membership} />
            )
          }
          selected={membership}
        />

        <SimpleButton
          className="mx-auto mt-2 opacity-80 border-error/30 text-error/50"
          text="cancel subscription"
          textClassName="text-error/60"
          iconPosition="left"
          icon={<Sad01Icon size={16} />}
        />
      </div>
    </Container>
  );
}
