export enum AuthorizedStatus {
    AUTHORIZED_PAYMENT = 0,
    UNAUTHORIZED_PAYMENT = 1,
}

export interface QueryRazorpayOrderDto {
    authorized?: AuthorizedStatus;
    receipt?: string;
    ordersFromDate?: Date | string;
    ordersTillDate?: Date | string;
    ordersToFetch?: number;
    skipOrders?: number;
}

export interface QueryRazorpayOneOrderDto {
    orderId: string;
}
