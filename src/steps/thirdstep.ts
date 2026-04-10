import type { globalData, addonsNames } from "../types";

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
    localStorage.setItem('functionalities', JSON.stringify(Array.from(addons)));
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
export function hydrateDataStep3(functionalities : string, allCheckboxes : NodeListOf<HTMLInputElement>)
{
    let savedData = JSON.parse(functionalities) as addonsNames[];
    let set = new Set(savedData);
        allCheckboxes.forEach((checkbox)=>{
            let functionality = checkbox.dataset.functionality as addonsNames;
            if(functionality && set.has(functionality))
                {
                    checkbox.checked = true;
                }
        }) 
    return savedData;
}
