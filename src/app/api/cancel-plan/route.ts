import { NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripeClient';
import {
  fetchUserById,
  getUserData,
  updateUserMembership,
} from '../controllers/userController';
import { MembershipType } from '@/types';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await getUserData(req);
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { subscription_id } = await fetchUserById(userId);

    if (!subscription_id) {
      return NextResponse.json(
        { error: 'No active subscription found for user' },
        { status: 404 }
      );
    }

    await stripe.subscriptions.cancel(subscription_id);

    await updateUserMembership({
      id: userId,
      membership: 'free' as MembershipType,
    });

    return NextResponse.json(
      { message: 'Subscription canceled successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return NextResponse.json({
      error: 'Internal Server Error',
      status: 500,
    });
  }
}
