import { stripe } from '@/lib/stripeClient';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { updateUserMembership } from '../controllers/userController';
import { MembershipType } from '@/types';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get('Stripe-Signature');
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return new NextResponse('Missing Webhook Secret', { status: 500 });
  }

  if (!signature) {
    return new NextResponse('Missing Stripe Signature', { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    if (event.type === 'checkout.session.completed') {
      const { metadata } = event.data.object;
      if (!metadata || !metadata['user_id'] || !metadata['membership_tier']) {
        return new NextResponse('User ID is missing in the session metadata.', {
          status: 400,
        });
      }

      const { user_id: userId, membership_tier: membership } = metadata;
      await updateUserMembership({
        id: userId,
        membership: membership as MembershipType,
      });
    }

    return new NextResponse(null, { status: 200 });
  } catch (err) {
    console.error('Error processing webhook event:', err);
    return new NextResponse('Invalid Stripe Signature', { status: 400 });
  }
}
