export type formData = {
    name : string,
    email : string,
    phone : string
}
export type planChoice = {
    planType: 'arcade' | 'advanced' | 'pro',
    billingRecurring: 'monthly' | 'yearly';
};
export interface globalData {
    plan?: planChoice,
    addsOn? : addonsNames[],
    personalInfo?: formData
}
export type User = {
    id: string,
    name: string,
    email : string,
    phone : string,
    password: string
}
export type UserAuthentificated = {
    name : string,
    email : string,
    phone : string
};
export type addonsNames = 'Online service' | 'Larger storage' | 'Customizable profile';

export interface OrderRequest {
    addons : addonsNames[],
    planBilling: 'monthly' | 'yearly',
    planType : string,
    totalPrice : number
}
export interface OrderResponse {
    orderId : string
};
export interface StripeResponse{
    url : string
};
// Mirror of OrderRequest but using database schema naming conventions
export interface OrderResponseFromDB extends OrderRequest{
    orderedAt : string,
    selectedPlan : string,
    billingInterval : 'monthly' | 'yearly',
    selectedAddons?: addonsNames[]
}
export interface OrdersResponseApi{
    orders: OrderResponseFromDB[]
}