import type { globalData, planChoice } from "../types";

export default function toggleBoxes(box : HTMLDivElement, boxes: NodeListOf<HTMLDivElement>)
{
    box.addEventListener('click',()=>{
    boxes.forEach((box)=>box.classList.remove('selected'));
    box.classList.add('selected');
    })
}
export function changeRecurrencyState(boxParagraphs : NodeListOf<HTMLParagraphElement>, isYearly : boolean, promoParagraphs: NodeListOf <HTMLParagraphElement>)
{
    boxParagraphs.forEach((paragraph)=>{
        if(paragraph)
            {
                if(isYearly)
                {
                    let yearlyAmount = Number(paragraph.dataset.yearly);
                    paragraph.textContent = `$${yearlyAmount}/yr`;
                }
                else{
                    let monthlyAmount = Number(paragraph.dataset.monthly);
                    paragraph.textContent = `$${monthlyAmount}/mo`;
                }
            }
        })
    promoParagraphs.forEach((paragraph)=>{
    paragraph.classList.toggle('ascuns', !isYearly);
    })
}
export function visualizeStep2Errors(boxes : NodeListOf <HTMLDivElement>, paragraph : HTMLParagraphElement)
{
    let isValid = true;
    let planTypeMarked = Array.from(boxes).some((box)=> box.classList.contains('selected'));
        if(!planTypeMarked){
            isValid = false;
            paragraph.textContent = 'Please select a plan!'
        }
        else{
            paragraph.textContent = '';
        }
        return isValid;
}
export function updateStep2Variables(boxes : NodeListOf<HTMLDivElement>, checkbox: HTMLInputElement, globalData : globalData)
{
    let activePlanChoice = null;
    boxes.forEach((box)=>{
        if(box.classList.contains('selected'))
        {
            activePlanChoice = box.dataset.plantype as 'arcade' | 'advanced' | 'pro';
        }
        })
    let activePaymentReccurency = (checkbox?.checked ? 'yearly' : 'monthly') as 'yearly' | 'monthly';
        if(activePaymentReccurency && activePlanChoice){ 
        globalData.plan = {
        planType: activePlanChoice,
        billingRecurring: activePaymentReccurency
        } as planChoice;     
        }
    localStorage.setItem("personal-plan", JSON.stringify(globalData.plan));
    return globalData.plan;
}
export function hydrateStep2Dates(localDataStep2: string, boxes: NodeListOf <HTMLDivElement>, checkbox: HTMLInputElement, globalData: globalData, boxParagraphs: NodeListOf<HTMLParagraphElement>, promoTexts:NodeListOf<HTMLParagraphElement>)
{
    let parsedData = JSON.parse(localDataStep2) as planChoice;
        if(parsedData)
        {
            let boxFound = Array.from(boxes).find((box)=> box.dataset.plantype === parsedData.planType);
            boxFound?.classList.add('selected');
            parsedData.billingRecurring === "yearly"? checkbox!.checked = true : checkbox!.checked = false;
            const isYearly = checkbox?.checked;
            changeRecurrencyState(boxParagraphs as NodeListOf<HTMLParagraphElement>, isYearly as boolean, promoTexts as NodeListOf <HTMLParagraphElement>);           
            updateStep2Variables(boxes, checkbox as HTMLInputElement, globalData);
            }
}