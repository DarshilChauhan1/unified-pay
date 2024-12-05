import Stripe from 'stripe';

export interface QueryStripeSubscriptionDto {
    priceId?: string;
    subscritptionFrom?: Date;
    subscriptionTo?: Date;
    limit?: number;
    lastRecordId?: string;
    stripeExtraParams?: Stripe.SubscriptionListParams;
    stripeExtraOptions?: Stripe.RequestOptions;
}

export interface QueryStripeOneSubscriptionDto {
    subscriptionId: string;
    stripeExtraParams?: Stripe.SubscriptionRetrieveParams;
    stripeExtraOptions?: Stripe.RequestOptions;
}