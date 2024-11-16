import Razorpay from "razorpay";
import { RazorPayCredentials } from "../../common/types/credentials.types";
import { CombinedOrderAndCheckoutSessionDto, CreateOrderDto } from "./dto/createOrder.dtot";
import { GetOneOrderDto, QueryOrderDto } from "./dto/queryOrder.dto";
import moment from 'moment'
import { UpdateOrderDto } from "./dto/upateOrder.dto";
import { parseQueryParams } from "../../common/helpers/parseQueryParams.helper";

export class RazorPayOrders {
    private razorpay: Razorpay
    constructor(credentials: RazorPayCredentials) {
        this.razorpay = new Razorpay({
            key_id: credentials.keyId,
            key_secret: credentials.keySecret
        })
    }
    async createRazorPayOrder(payload: CreateOrderDto) {
        try {
            this.validateOrder(payload)
            // Create an order
            const order = await this.razorpay.orders.create(payload)
            return order
        } catch (error) {
            console.log(error)
            throw error
        }
    }

    async createCheckoutSessionWithOrder(payload: CombinedOrderAndCheckoutSessionDto): Promise<[any, any]> {
        try {
            const { order, checkoutSession } = payload
            this.validateOrder(order)
            const orderData = await this.razorpay.orders.create(order)

            const checkoutSessionData = {
                key: checkoutSession.apiKey,
                name: checkoutSession.businessName,
                description: checkoutSession.description,
                image: checkoutSession.imageUrl,
                callback_url: checkoutSession.callBackUrl,
                prefill: checkoutSession.customerInfo,
                order_id: orderData.id,
                amount: order.amount,
                currency: order.currency,
                notes: checkoutSession.notes,
                theme: checkoutSession.theme
            }

            return [orderData, checkoutSessionData];

        } catch (error) {
            throw error
        }
    }

    async getAllOrders(payload: QueryOrderDto) {
        try {
            const {orderFromTime, orderUntilTime, authorized, ordersToFetch, receipt, skipOrders} = payload
            const formattedDates = parseQueryParams({ from : orderFromTime, to : orderUntilTime })
            const queryData = {
                receipt,
                authorized,
                ...formattedDates
            }
            const orders = await this.razorpay.orders.all(queryData)
            return orders
        } catch (error) {
            throw error
        }
    }

    async getOrderById(payload: GetOneOrderDto) {
        try {
            const { orderId } = payload
            const order = await this.razorpay.orders.fetch(orderId)
            return order
        } catch (error) {
            throw error
        }
    }

    async getOrderPayments(payload: GetOneOrderDto) {
        try {
            const { orderId } = payload
            const payments = await this.razorpay.orders.fetchPayments(orderId)
            return payments
        } catch (error) {
            throw error
        }
    }

    async updateOrder(payload: UpdateOrderDto) {
        try {
            const { orderId, notes } = payload
            const order = await this.razorpay.orders.edit(orderId, { notes: notes })
            return order
        } catch (error) {
            throw error
        }
    }

    private validateOrder(payload: CreateOrderDto) {
        const { receipt, partialPayment, first_payment_min_amount } = payload
        if (receipt && receipt.length > 40) {
            throw new Error('Receipt should be of max 40 characters')
        }

        if (partialPayment && !first_payment_min_amount) {
            throw new Error('first_payment_min_amount is required when partialPayment is true')
        }
    }
}