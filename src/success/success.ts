document.addEventListener('DOMContentLoaded', async()=>{
    /* inserting the order id into confirm message after user pays */
    let confirmMessage = document.querySelector<HTMLSpanElement>('#order-message');
    let orderId = new URLSearchParams(window.location.search).get("orderId");
    if(confirmMessage){
    confirmMessage.textContent = orderId;
    }
})