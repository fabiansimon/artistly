import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../../controllers/userController';
import { stripe } from '@/lib/stripeClient';

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

    console.log(userId, email);

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/checkout-success',
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
        userId,
      },
      subscription_data: {
        trial_settings: {
          end_behavior: {
            missing_payment_method: 'cancel',
          },
        },
        trial_period_days: 7,
      },
    });

    console.log('stripeSession', stripeSession);
    return NextResponse.json({ stripeSession }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : 'An unknown error occurred',
      },
      { status: 500 }
    );
  }
}
