import { IMap } from "razorpay/dist/types/api";
import { Currency } from "../../../common/types/currency.type";

export interface CreatePlanDto {
    billingFrequency : RazorPayBillingFrequency,
    billingInterval : number,
    name : string,
    planAmount : number,
    currency : Currency,
    planDescription ?: string,
    notes ?: any
}