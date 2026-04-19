import type {OrdersResponseApi } from "../types";

document.addEventListener('DOMContentLoaded', async()=>{
    let dataRecieved = await getOrders();    
    let tableBody = document.querySelector<HTMLTableElement>('#orders-body');
    if(dataRecieved && dataRecieved.orders && tableBody)
    {
        tableBody.innerHTML = '';
        dataRecieved.orders.forEach((order)=>{
            const rowElement = document.createElement('tr');
            rowElement.className = 'hover:bg-blue-50/30 transition-colors';
            const orderDate = new Date(order.orderedAt).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            });
            rowElement.innerHTML = `
            <td class="px-6 py-4 text-sm font-bold text-[#022959]">${order.selectedPlan}</td>
            <td class="px-6 py-4 text-sm text-[#483eff] font-medium">${order.billingInterval || 'Monthly'}</td>
            <td class="px-6 py-4 text-xs text-gray-500">${order.selectedAddons?.join(', ') || 'No selected addons'}</td>
            <td class="px-6 py-4 text-xs text-blue-950">${order.status || 'Pending'}</td>
            <td class="px-6 py-4 text-sm text-gray-400">${orderDate}</td>
            <td class="px-6 py-4 text-sm font-bold text-[#022959]">${order.totalPrice}</td>
            `
            tableBody.appendChild(rowElement);
        })
    }   
    async function getOrders(){
        try{
        let req = await fetch('/api/orders', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        if(!req.ok)
        {
            const errorText =  await req.text();
            console.error(`Something bad happened! ${errorText}`);
        }
        let data : OrdersResponseApi = await req.json();
        return data;
    }catch(err)
    {
        console.log('Something bad happened during the fetch!');
    }
    }
})
