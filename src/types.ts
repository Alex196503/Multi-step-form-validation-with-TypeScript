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
export type addonsNames = 'Online service' | 'Larger storage' | 'Customizable profile'