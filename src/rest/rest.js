

export async function requestData() {
    let data = await fetch(`/api/greeting?name=${encodeURIComponent("server online")}`).then(response => response.json());
    console.log(data); 
    return data; 
}