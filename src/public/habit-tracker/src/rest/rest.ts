

// export async function requestData() {
//     let data = await fetch(`/api/greeting?name=${encodeURIComponent("server online")}`).then(response => response.json());
//     console.log(data); 
//     return data; 
// }

export async function getHabits(user_id: string) {
    let habit_ids = await fetch(`/api/habits/get/${encodeURIComponent(user_id)}`)
                            .then(response => response.json()); 
    return habit_ids;  
}

export async function createHabit(user_id: string, new_habit_id: string) {
    let habit: any = await fetch(`/api/habits/create/${encodeURIComponent(user_id)}/${encodeURIComponent(new_habit_id)}`, { method: 'POST' })
                            .then(response => response.json()); 
    return habit;  
}