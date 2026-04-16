import type { addonsNames, planChoice } from "../types";
// UI utilities to dynamically populate the Summary plan info and add-on rows.
export default function renderOrderSummary(plan: planChoice, step4Paragraph: HTMLParagraphElement, step4valueParagraph: HTMLParagraphElement, planPrices:  Record <planChoice['billingRecurring'], Record <planChoice['planType'], number>>, totalParagraph : HTMLParagraphElement)
{
    const suffix = plan.billingRecurring === "monthly" ? "mo" : "yr";
    step4Paragraph.textContent = `${plan.planType.charAt(0).toUpperCase() + plan.planType.slice(1)}(${plan.billingRecurring.charAt(0).toUpperCase() + plan.billingRecurring.slice(1)})`;
    totalParagraph.textContent = plan.billingRecurring === 'monthly' ? "Total (per month)" : "Total (per year)";
    const price = planPrices[plan.billingRecurring][plan.planType];
    step4valueParagraph.textContent = `$${price}/${suffix}`;
    return price;
}
export function createAddonRow(plan: planChoice, addon: addonsNames, addonsPrice: Record <planChoice['billingRecurring'], Record<addonsNames, number>>, parentStep4: HTMLDivElement) : number
{
      if(plan){
        let sectionAddon = document.createElement('section');
        sectionAddon.className = 'section-total mt-3';
        let suffix = plan.billingRecurring === "monthly"? "mo" : "yr";
        sectionAddon.innerHTML = `
        <p class="link-change no-underline">${addon}</p>
        <p class="paragraph-lead text-[12px] font-medium">$${addonsPrice[plan.billingRecurring][addon]}/${suffix}</p>`;
        parentStep4?.appendChild(sectionAddon);
        } 
        return addonsPrice[plan.billingRecurring][addon];     
}
// Function that calculates the total package requested by the user
export function calculateTotal(arrayPrices : number[], packagePrice : number, totalParagraphValue: HTMLParagraphElement, total : number, sufix : string)
{
    let addonsSum = arrayPrices.reduce((acc, el)=> {
            return acc + el;
        }, 0)
    if(packagePrice && arrayPrices && totalParagraphValue){
        total = packagePrice + addonsSum;
        totalParagraphValue.textContent = `$${total}/${sufix}`;
    }
    return total;
}