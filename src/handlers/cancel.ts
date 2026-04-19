document.addEventListener('DOMContentLoaded', ()=>{
    let spanElement = document.querySelector<HTMLSpanElement>('.order-span');
    let orderId = new URLSearchParams(window.location.search).get('orderId');
    if(spanElement){
    spanElement.textContent = orderId;
    }
    makeReqToCancelApi();
    async function makeReqToCancelApi()
    {
        try{
        let req = await fetch('/api/cancel-order', {
            method: 'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body: JSON.stringify({
                order_id : orderId
            })
        })
        let data = await req.json();
        if(!req.ok)
        {
            console.log(`Request data not ok!`);
        }
        console.log(`Data: ${data.order_id} has been sent to the server`);
    }catch(err)
    {
        console.error(`Something bad occured during the request ${err}`);
    }
    }
})