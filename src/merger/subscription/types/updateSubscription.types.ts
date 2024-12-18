import { Subscriptions } from 'razorpay/dist/types/subscriptions';
import Stripe from 'stripe';
import { GatewayProvider } from '../../../common/types/providers.types';
import { UpdateRazorpaySubscriptionDto } from '../../../gateways/razorpay/subscriptions/dto/updateSubscription.dto';
import { UpdateStripeSubscriptionDto } from '../../../gateways/stripe/subscriptions/dto/updateSubcription.dto';

export type MergerUpdateSubscription = {
    [GatewayProvider.Razorpay]: {
        payload: UpdateRazorpaySubscriptionDto;
        returnType: Subscriptions.RazorpaySubscription;
    };
    [GatewayProvider.Stripe]: {
        payload: UpdateStripeSubscriptionDto;
        returnType: Stripe.Subscription;
    };
};
