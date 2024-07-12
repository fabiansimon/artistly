'use client';

import Avatar from '@/components/Avatar';
import Container from '@/components/Container';
import LoadingView from '@/components/LoadingView';
import SimpleButton from '@/components/SimpleButton';
import { concatName } from '@/lib/utils';
import { useDataLayerContext } from '@/providers/DataLayerProvider';
import { useUserContext } from '@/providers/UserProvider';
import { ArrowLeft02Icon, UserAccountIcon } from 'hugeicons-react';

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

  const { first_name, last_name, email, image_url } = user;
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
    </Container>
  );
}
