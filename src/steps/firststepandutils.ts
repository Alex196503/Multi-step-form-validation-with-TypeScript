import type { formData, globalData } from "../types";

export function visualizeFormErrors(nameInput : HTMLInputElement, errorNameParagraph : HTMLParagraphElement, emailInput : HTMLInputElement, phoneInput : HTMLInputElement, errorEmailParagraph : HTMLParagraphElement, errorPhoneParagraph : HTMLParagraphElement )
{
    let emailRegex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$/;
    let phoneRegex = /^(?:\+40|0)[237][0-9]{8}$/;
    const nameVal = nameInput.value.trim();
    const emailVal = emailInput.value.trim();
    const phoneVal = phoneInput.value.trim();
    const isPhoneValid = phoneRegex.test(phoneVal);
    const isEmailValid = emailRegex.test(emailVal);
    const isNameValid = nameVal.length >=4 && nameVal.length <= 19;
    toggleError(nameInput, errorNameParagraph, isNameValid, "Invalid name (5-19) characters required");
    toggleError(emailInput, errorEmailParagraph, isEmailValid, "Invalid email");
    toggleError(phoneInput, errorPhoneParagraph, isPhoneValid, "Invalid phone number!");
    return isPhoneValid && isNameValid && isEmailValid;
}
function toggleError(input : HTMLInputElement, paragraph : HTMLParagraphElement, isValid : boolean, msg : string)
{
    input.classList.toggle('bordered', !isValid);
    paragraph.textContent = isValid? '' : msg;
}
/* function that allow us to switch between tabs */
export const updateUi = (sectionTabs: NodeListOf <HTMLDivElement>, count : number) => {
    sectionTabs.forEach((section)=>{
    section.hidden = true;
    })
    let sectionFound = Array.from(sectionTabs).find((section)=> Number(section.dataset.id) === count);
    if(sectionFound){
    sectionFound.hidden = false;
        }
    }
/* function updating the circles also*/    
export function updateCircles(spanCircles:NodeListOf<HTMLSpanElement>,  count : number)
    {
        spanCircles.forEach((span)=>span.classList.add('not-active'));
        const displayStep = count >= 4 ? 3 : count;
        let targetCircle = displayStep;
        if(spanCircles[targetCircle])
        {
            spanCircles[targetCircle].classList.remove('not-active');
        }
        if(count >=4)
        {
            spanCircles.forEach((span)=>span.classList.add('disabled'));
        }
}

export function saveDataToLocalStorage(globalData: globalData, nameInput: HTMLInputElement, emailInput: HTMLInputElement, phoneInput: HTMLInputElement)
{
    globalData.personalInfo = {
        name: nameInput!.value,
        email: emailInput!.value,
        phone: phoneInput!.value
        }
        if(globalData.personalInfo){
        localStorage.setItem('personal-info', JSON.stringify(globalData.personalInfo));
    }
}
export function loadPersistedData(nameInput: HTMLInputElement, emailInput: HTMLInputElement, phoneInput : HTMLInputElement)
{
    let savedDataStep1 = localStorage.getItem('personal-info');
    if(savedDataStep1)
    {
        let parsed = JSON.parse(savedDataStep1) as formData;
        nameInput!.value = parsed.name;
        emailInput!.value = parsed.email;
        phoneInput!.value = parsed.phone;
    }
}