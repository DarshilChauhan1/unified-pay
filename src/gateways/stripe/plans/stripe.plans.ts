import Stripe from 'stripe';
import { convertDateToUnix } from '../../../common/helpers/convertDateToUnix';
import { CreateStripePlanDto } from './dto/createPlan.dto';
import { QueryStripeOnePlanDto, QueryStripePlanDto } from './dto/queryPlan.dto';
import { UpdateStripePlanDto } from './dto/updatePlan.dto';

class StripePlans {
    private stripe: Stripe;
    constructor(stripeInstance: Stripe) {
        this.stripe = stripeInstance;
    }

    async createPlan(createPlanDto: CreateStripePlanDto): Promise<Stripe.Price> {
        try {
            const {
                amount,
                currency,
                interval,
                name,
                nickname,
                active,
                metadata,
                intervalCount,
                stripeExtraOptions,
                stripeExtraParams,
            } = createPlanDto;
            const plan = await this.stripe.prices.create(
                {
                    currency,
                    unit_amount: amount,
                    recurring: { interval, interval_count: intervalCount ?? 1 },
                    product_data: {
                        name: name,
                    },
                    nickname,
                    active,
                    metadata,
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );
            return plan;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async updatePlan(planId: string, updatePlanDto: UpdateStripePlanDto): Promise<Stripe.Price> {
        try {
            const { stripeExtraOptions, stripeExtraParams, ...restPlanDto } = updatePlanDto;
            const plan = await this.stripe.prices.update(
                planId,
                {
                    ...restPlanDto,
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );
            return plan;
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getAllPlans(queryPlanDto: QueryStripePlanDto): Promise<Stripe.ApiList<Stripe.Price>> {
        try {
            const {
                active,
                createdAfter,
                createdBefore,
                limit,
                lastRecordId,
                currency,
                stripeExtraOptions,
                stripeExtraParams,
            } = queryPlanDto;
            const formattedDates = convertDateToUnix({
                createdAfter,
                createdBefore,
            });
            if (limit && (limit < 1 || limit > 100)) {
                throw new Error('Limit must be between 1 and 100');
            }

            const query = {};
            const range = {};
            if (active !== undefined) {
                query['active'] = active;
            }

            if (formattedDates.createdAfter) {
                range['gte'] = formattedDates.createdAfter;
            }

            if (formattedDates.createdBefore) {
                range['lte'] = formattedDates.createdBefore;
            }

            if (currency) {
                query['currency'] = currency;
            }

            if (limit) {
                query['limit'] = limit;
            }

            if (lastRecordId) {
                query['starting_after'] = lastRecordId;
            }

            if (Object.keys(range).length > 0) {
                query['created'] = range;
            }

            return this.stripe.prices.list(
                {
                    ...query,
                    ...stripeExtraParams,
                },
                stripeExtraOptions,
            );
        } catch (error) {
            console.error(error);
            throw error;
        }
    }

    async getPlan(payload: QueryStripeOnePlanDto): Promise<Stripe.Price> {
        try {
            const { planId, stripeExtraOptions, stripeExtraParams } = payload;
            return await this.stripe.prices.retrieve(planId, stripeExtraParams, stripeExtraOptions);
        } catch (error) {
            console.error(error);
            throw error;
        }
    }
}

export default StripePlans;