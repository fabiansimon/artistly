import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../../controllers/userController';
import { stripe } from '@/lib/stripeClient';
import { getMembershipById } from '@/constants/memberships';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, email } = await getUserData(req);
    if (!userId || !email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const priceId = params.id;
    if (!priceId) {
      return NextResponse.json(
        { error: 'Bad Request: Missing Price ID' },
        { status: 400 }
      );
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/profile',
      cancel_url: 'http://localhost:3000',
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        ['user_id']: userId,
        ['membership_tier']: getMembershipById(priceId) || '',
      },
    });

    return NextResponse.json({ url: stripeSession.url }, { status: 200 });
  } catch (error) {
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
