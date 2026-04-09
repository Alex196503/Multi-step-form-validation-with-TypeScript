import type { globalData } from "../types";

export default function storeAddonsChosen(checkbox : HTMLInputElement, addons: Set<string>)
{
    const functionality = checkbox.dataset.functionality;
    if(!functionality) return;
    if(checkbox.checked)
        {
            addons.add(functionality)
        }
    else{
            addons.delete(functionality);
    }
}
export function updateAddonPrices(priceParagraphs: NodeListOf <HTMLParagraphElement>, globalData : globalData)
{
    Array.from(priceParagraphs).forEach((paragraph)=>{
        if(globalData.plan?.billingRecurring === "monthly")
        {            
            let price = Number(paragraph.dataset.monthly);
            paragraph.textContent = `+${price}/mo`;
        }
        else if(globalData.plan?.billingRecurring === "yearly"){            
            let price = Number(paragraph.dataset.yearly);
            paragraph.textContent = `+${price}/yr`;
        }
    })
}
