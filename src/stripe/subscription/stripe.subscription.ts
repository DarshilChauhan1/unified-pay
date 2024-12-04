import Stripe from 'stripe';
import { parseQueryParams } from '../../common/helpers/parseQueryParams.helper';
import { StripeCredentials } from '../../common/types/credentials.types';
import StripeCustomer from '../customer/stripe.customer';
import { CreateSubscriptionDto } from './dto/createSubscription.dto';
import { QuerySubscriptionDto } from './dto/querySubscription.dto';
import { UpdateSubscriptionDto } from './dto/updateSubcription.dto';

class StripeSubscription {
    private stripe: Stripe;
    private stripeCustomer: StripeCustomer;
    constructor(credentials: StripeCredentials) {
        this.stripe = new Stripe(credentials.apiKey, {
            apiVersion: credentials.apiVersion,
        });
    }

    async createSubscription(payload: CreateSubscriptionDto): Promise<Stripe.Subscription> {
        try {
            const {
                priceId,
                metadata,
                description,
                offerId,
                planQuantity,
                name,
                email,
                phone,
                stripeExtraParams,
                stripeExtraOptions,
            } = payload;

            const customer = await this.stripeCustomer.createCustomer({
                name: name ?? 'Guest',
                email,
                phone,
            });
            const subscription = await this.stripe.subscriptions.create(
                {
                    customer: customer.id,
                    items: [{ price: priceId, quantity: planQuantity }],
                    metadata,
                    description,
                    discounts: offerId ? [{ coupon: offerId }] : [],
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );
            return subscription;
        } catch (error) {
            return error;
        }
    }

    async getAllSubscriptions(payload: QuerySubscriptionDto): Promise<Stripe.ApiList<Stripe.Subscription>> {
        try {
            const {
                priceId,
                limit,
                lastRecordId,
                subscriptionTo,
                subscritptionFrom,
                stripeExtraOptions,
                stripeExtraParams,
            } = payload;
            const formatDates = parseQueryParams({ from: subscritptionFrom, to: subscriptionTo });
            const query = {};
            if (priceId) {
                query['price'] = priceId;
            }

            if (limit) {
                query['limit'] = limit;
            }

            if (lastRecordId) {
                query['starting_after'] = lastRecordId;
            }

            const subscriptions = await this.stripe.subscriptions.list(
                {
                    ...query,
                    ...formatDates,
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );

            return subscriptions;
        } catch (error) {
            return error;
        }
    }

    async getSubscriptionById(
        subscriptionId: string,
        stripeExtraParams?: Stripe.SubscriptionRetrieveParams,
        stripeExtraOptions?: Stripe.RequestOptions,
    ): Promise<Stripe.Subscription> {
        try {
            const subscription = await this.stripe.subscriptions.retrieve(
                subscriptionId,
                stripeExtraParams,
                stripeExtraOptions,
            );
            return subscription;
        } catch (error) {
            return error;
        }
    }

    async updateSubscription(payload: UpdateSubscriptionDto): Promise<Stripe.Subscription> {
        try {
            const { metadata, offerId, planQuantity, priceId, stripeExtraOptions, stripeExtraParams } = payload;
            return await this.stripe.subscriptions.update(
                priceId,
                {
                    metadata,
                    items: [{ id: priceId, quantity: planQuantity }],
                    discounts: offerId ? [{ coupon: offerId }] : [],
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );
        } catch (error) {
            throw error;
        }
    }

    async cancelSubscription(
        subscriptionId: string,
        stripeExtraParams?: Stripe.SubscriptionCancelParams,
        stripeExtraOptions?: Stripe.RequestOptions,
    ): Promise<Stripe.Subscription> {
        try {
            return await this.stripe.subscriptions.cancel(subscriptionId, stripeExtraParams, stripeExtraOptions);
        } catch (error) {
            throw error;
        }
    }

    async deleteOfferFromSubscription(
        subscriptionId: string,
        stripeExtraParams?: Stripe.SubscriptionDeleteDiscountParams,
        stripeExtraOptions?: Stripe.RequestOptions,
    ): Promise<Stripe.DeletedDiscount> {
        try {
            return await this.stripe.subscriptions.deleteDiscount(
                subscriptionId,
                stripeExtraParams,
                stripeExtraOptions,
            );
        } catch (error) {
            throw error;
        }
    }

    async pauseSubscription(
        subscriptionId: string,
        stripeExtraParams?: Stripe.SubscriptionUpdateParams,
        stripeExtraOptions?: Stripe.RequestOptions,
    ): Promise<Stripe.Subscription> {
        try {
            return await this.stripe.subscriptions.update(
                subscriptionId,
                {
                    pause_collection: { behavior: 'void' },
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );
        } catch (error) {
            throw error;
        }
    }

    async resumeSubscription(
        subscriptionId: string,
        stripeExtraParams?: Stripe.SubscriptionResumeParams,
        stripeExtraOptions?: Stripe.RequestOptions,
    ): Promise<Stripe.Subscription> {
        try {
            return await this.stripe.subscriptions.resume(subscriptionId, stripeExtraParams, stripeExtraOptions);
        } catch (error) {
            throw error;
        }
    }
}

export default StripeSubscription;
