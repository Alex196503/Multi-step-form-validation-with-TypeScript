export let logOut = async() => {
    try{
        await fetch('/logout', {
            method: 'POST',
            headers:{
                'Content-Type': 'application/json'
            }
        });
        localStorage.clear();
        console.log("Logging out...");
        window.location.href = '/login';
    }catch(err)
    {
        console.log(`Something bad happened! ${err}`);
    }
}
