import { timeStamp } from "console";

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

export async function updateHabitObservations(user_id: string, habit_id: string, timestamp: Date, value: number) {
    let habit: any = await fetch(`/api/habits/update/${encodeURIComponent(user_id)}/${encodeURIComponent(habit_id)}/${timestamp.toISOString()}/${encodeURIComponent(value)}`, { method: 'POST' })
                            .then(response => response.json()); 
    return habit;    
}