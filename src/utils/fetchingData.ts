import type { globalData, OrderResponse, UserAuthentificated } from "../types";

export async function fetchData(userAuthentificated: UserAuthentificated, nameInput: HTMLInputElement, emailInput: HTMLInputElement, phoneInput: HTMLInputElement)
    {try{
        let response = await fetch('/api/user');
        if(response.ok)
        {
            const data = await response.json();
            userAuthentificated.name = data.name;
            userAuthentificated.email = data.email;
            userAuthentificated.phone = data.phone;            
            if(nameInput && emailInput && phoneInput)
            {
                nameInput.value = userAuthentificated.name;
                emailInput.value = userAuthentificated.email;
                phoneInput.value = userAuthentificated.phone;
            }
        }
    }catch(error)
    {
        console.error('Something bad happened while bringing user data!' + error);
    }
}
const sleep  = (ms : number) => {
    return new Promise((res, _rej)=>{
        return setTimeout(res, ms);
    })
}
export async function confirmAndSaveOrder(globalData: globalData, totalPriceSaved : number, confirmMessage: HTMLParagraphElement)
{
 try{      
        confirmMessage.innerHTML = 'Your order is processing...';    
        let data = await fetch('/api/order',{
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                addons : globalData.addsOn,
                planBilling: globalData.plan?.billingRecurring,
                planType: globalData.plan?.planType,
                totalPrice : totalPriceSaved
            })
        }) 
        await sleep(1000);
        if(data.ok){
        let Order : OrderResponse = await data.json();
        confirmMessage.innerHTML = `Your order with number ${Order!.orderId} was succesfully registered! We hope you have fun using our platform. If you ever need support, please feel free to email us at <a href="mailto:support@loremgaming.com" class="underline hover:text-purplish-blue transition-colors">support@loremgaming.com. </a>`;
        }
        else
        {
            confirmMessage.innerText = "There was a problem saving your order. Please try again.";
            return;
        }
    }catch(e)
        {
            console.log("Something bad happened!" + e);
        }
    }     