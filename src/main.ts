import { logOut } from './utils/logoutFromFrontend';
import { updateCircles, updateUi, visualizeFormErrors } from './steps/firststepandutils';
import renderOrderSummary, { calculateTotal, createAddonRow } from './steps/fourthstep';
import toggleBoxes, { changeRecurrencyState, hydrateStep2Dates, updateStep2Variables, visualizeStep2Errors } from './steps/secondstep';
import storeAddonsChosen, { hydrateDataStep3, updateAddonPrices } from './steps/thirdstep';

import './style/style.css';
import type { addonsNames, globalData, planChoice, UserAuthentificated } from './types';
import { confirmAndSaveOrder, fetchData } from './utils/fetchingData';
// vezi cu orderId maine orderId sa afiseze comanda la confirm + da ii push branch si stripe maine integrare 
document.addEventListener('DOMContentLoaded', async() => {
    let nameInput = document.querySelector<HTMLInputElement>('#name');
    let emailInput = document.querySelector<HTMLInputElement>('#email');
    let phoneInput = document.querySelector<HTMLInputElement>('#phone');
    // function that brings some data from the backend to the client
    let userAuthentificated : UserAuthentificated = {name: '', email: '', phone: ''};
    if(nameInput && emailInput && phoneInput){
    await fetchData(userAuthentificated, nameInput, emailInput, phoneInput);
    }
    let spanCircles = document.querySelectorAll<HTMLSpanElement>('.span-circle');
    let errorNameParagraph = document.querySelector<HTMLParagraphElement>('#name-error-paragraph');
    let errorEmailParagraph = document.querySelector<HTMLParagraphElement>('#email-error-paragraph');
    let errorPhoneParagraph = document.querySelector<HTMLParagraphElement>('#phone-error-paragraph');
    let errorPlanParagraph = document.querySelector<HTMLParagraphElement>('#error-message-plan');
    let promoTexts = document.querySelectorAll<HTMLParagraphElement>('.paragraph-down');
    let boxes = document.querySelectorAll<HTMLDivElement>('.box');
    let sectionLink = document.querySelector<HTMLAnchorElement>('#change-section');
    let allCheckboxes = document.querySelectorAll <HTMLInputElement>('.form-control');
    let boxParagraphs = document.querySelectorAll <HTMLParagraphElement>('.section-box .text-secondary');
    let checkbox = document.querySelector<HTMLInputElement>('#billing-toggle');
    let btnsNext = document.querySelectorAll<HTMLButtonElement>('.btn-next');
    let btnsBack = document.querySelectorAll<HTMLButtonElement>('.btn-back');
    let btnStep2 = document.querySelector<HTMLButtonElement>('#btn-2');
    let btnStep3 = document.querySelector<HTMLButtonElement>('#btn-3');
    let btnConfirm = document.querySelector<HTMLButtonElement>('#btn-4');
    let priceParagraphs = document.querySelectorAll<HTMLParagraphElement>('.price-paragraph');
    let checkboxAddons = document.querySelectorAll<HTMLInputElement>('.form-control');
    let step4Paragraph = document.querySelector<HTMLParagraphElement>('#step4-paragraph');
    let parentStep4 = document.querySelector<HTMLDivElement>('#parent-child');
    let totalParagraph = document.querySelector<HTMLParagraphElement>('#total-paragraph');
    let totalParagraphValue = document.querySelector<HTMLParagraphElement>('#total-paragraph-value');
    let step4valueParagraph = document.querySelector<HTMLParagraphElement>('#value-step4-paragraph');
    const logoutBtn = document.querySelector<HTMLButtonElement>('#btn-logout');
    let confirmMessage = document.querySelector<HTMLParagraphElement>('#confirm-message');
    let addons :Set <addonsNames> = new Set();
    let count = 0;
    let total = 0;
    let totalPriceSaved = 0;
    let packagePrice : number;
    let globalData : globalData  = {};
    let arrayPrices : number[] = [];
    const planPrices: Record <planChoice['billingRecurring'], Record <planChoice['planType'], number>> = {
        monthly: {'arcade': 9, 'advanced':12, 'pro': 15},
        yearly: {'arcade': 90, 'advanced':120, 'pro':150}
    };
    const addonsPrice: Record <planChoice['billingRecurring'], Record<addonsNames, number>> = {
        monthly: {'Online service': 1, 'Larger storage': 2, 'Customizable profile': 2},
        yearly: {'Online service': 10, 'Larger storage': 20, 'Customizable profile': 20}
    };
    let sectionTabs = document.querySelectorAll<HTMLDivElement>('.section');
    
    /* logout handler */
    logoutBtn?.addEventListener('click', async()=>{
        await logOut();
    })
    /* function that confirms the order and sends it to our mongodb database */
    btnConfirm?.addEventListener('click', async()=>{      
        if(confirmMessage){
       confirmAndSaveOrder(globalData, totalPriceSaved, confirmMessage)
        }
    })
    /* listeners for going back to a previous step or going to the next step */
    updateCircles(spanCircles, count);
    btnsNext.forEach((btn)=>{
        btn.addEventListener('click', (e)=>{
            if(count < sectionTabs.length - 1)
            {
                e.preventDefault();
                switch(count)
                {
                    case 0:
                        let isStepValid1 = visualizeFormErrors(nameInput as HTMLInputElement, errorNameParagraph as HTMLParagraphElement, emailInput as HTMLInputElement, phoneInput as HTMLInputElement, errorEmailParagraph as HTMLParagraphElement, errorPhoneParagraph as HTMLParagraphElement);
                        if(!isStepValid1) return;
                        break;
                    case 1:
                        let isStepValid2 = visualizeStep2Errors(boxes, errorPlanParagraph as HTMLParagraphElement);
                        if(!isStepValid2) return;

                        break;
                }
                count++;
                updateUi(sectionTabs, count);
                updateCircles(spanCircles, count);
            }
        })
    })
    
    btnsBack.forEach((btn)=>{
        btn.addEventListener('click',()=>{
            if(count >= 1)
            {
                count--;
                updateUi(sectionTabs, count);
                updateCircles(spanCircles, count);
            }
        })
    })
    /* listener for travelling to step 1 without pressing go back two times */
    sectionLink?.addEventListener('click', ()=>{
        count = 1;
        updateUi(sectionTabs, count);
        updateCircles(spanCircles, count);
    })
        spanCircles.forEach((span)=>{
        span.addEventListener('click', ()=>{
           let target = Number(span.dataset.tab);
           if(target <= count)
           {
                count = target;
                updateUi(sectionTabs, count);
                updateCircles(spanCircles, count);
           }
           else{
                console.log("Validation required!");
           }
        })
    })   
    let functionalities = localStorage.getItem('functionalities');
    if(functionalities){
        let savedData = hydrateDataStep3(functionalities, allCheckboxes)        
        globalData.addsOn = savedData;
    }
   //listeners for the span circles and the boxes to make an active state for each of them
    boxes.forEach((box)=>{
        toggleBoxes(box, boxes);
    })
    checkbox?.addEventListener('change',()=>{
        const isYearly = checkbox.checked;
        changeRecurrencyState(boxParagraphs as NodeListOf<HTMLParagraphElement>, isYearly as boolean, promoTexts as NodeListOf <HTMLParagraphElement>);           
    })
    btnStep2?.addEventListener('click', ()=>{
        if(errorPlanParagraph){
       visualizeStep2Errors(boxes, errorPlanParagraph)
        }
    })    
    /* Listeners for updating step2 and step3 states*/
    btnStep2?.addEventListener('click', ()=>{
        if(checkbox){
        updateStep2Variables(boxes, checkbox, globalData)
        }
    })   
    btnStep2?.addEventListener('click', ()=>{        
        updateAddonPrices(priceParagraphs as NodeListOf<HTMLParagraphElement>, globalData as globalData)
    }) 
    let localDataStep2 = localStorage.getItem('personal-plan');
    if(localDataStep2!== 'undefined' && localDataStep2 && checkbox)
    {
        hydrateStep2Dates(localDataStep2, boxes, checkbox, globalData, boxParagraphs, promoTexts)
    }    
    btnStep3?.addEventListener('click', ()=>{
        checkboxAddons.forEach((checkbox)=>{
            storeAddonsChosen(checkbox, addons);
        })   
        globalData.addsOn = Array.from(addons.values());
        const plan = globalData.plan;
        const sufix = plan?.billingRecurring === "monthly"? "mo" : "yr";
        if(plan && step4Paragraph && step4valueParagraph && totalParagraph && totalParagraphValue)
        {
            packagePrice = (renderOrderSummary(plan, step4Paragraph, step4valueParagraph, planPrices, totalParagraph));
        }
        // Syncs add-ons state and triggers the UI render for the final Summary step.
        parentStep4!.innerHTML = '';
        arrayPrices = [];
        globalData.addsOn.forEach((addon)=>{
            if(plan && parentStep4){
            arrayPrices.push((createAddonRow(plan, addon, addonsPrice, parentStep4)));
            }
        })
        if(totalParagraphValue){
         totalPriceSaved = (calculateTotal(arrayPrices, packagePrice, totalParagraphValue, total, sufix));
        }
    })   
})