import { NextRequest, NextResponse } from 'next/server';
import { getUserData } from '../controllers/userController';
import { stripe } from '@/lib/stripeClient';

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId, email } = await getUserData(req);
    const stripeSession = await stripe.checkout.sessions.create({
      success_url: 'http://localhost:3000/checkout-success',
      cancel_url: 'http://localhost:3000',
      payment_method_types: ['card'],
      mode: 'subscription',
      billing_address_collection: 'auto',
      customer_email: email,
      line_items: [
        {
          price: 1,
          quantity: 1,
        },
      ],
    });
  } catch (error) {
    return NextResponse.json({
      error,
      status: 500,
    });
  }
}
