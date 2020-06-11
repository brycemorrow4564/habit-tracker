import _ from "lodash";
import { Tweenable } from "./tween"; 

export const reducerInitialState = {
    'q': [], 
    'queueCount': 0, 
    'running': false,
    'timestamp': 0, 
}; 

export interface ReducerState {
    timestamp: number, 
    q: any[], 
    queueCount: number, 
    running: boolean 
}

const mutators: { [key: string] : any } = { 
    'RUN ALL': ((state: ReducerState, [type, payload]: [any, any]) => {
        return { ...state, running: true, queueCount: state.queueCount + 1 };  
    }),
    'STEP TIME': ((state: ReducerState, [type, timestamp]: [any, any]) => {
        let newQ = _.cloneDeep(state.q); 
        let finishedI: Set<number> = new Set(); 
        for (let i = 0; i < newQ.length; i++) {
            let tweenable: Tweenable = _.clone(newQ[i]);
            let finished = false;  
            if (!tweenable.running()) {
                tweenable.start(timestamp); 
            } else {
                finished = tweenable.update(timestamp).finished; 
            }
            if (finished) {
                finishedI.add(i); 
            }
            newQ[i] = tweenable;
        }
        newQ = newQ.filter((d: any, i: number) => !finishedI.has(i)); 
        return { 
            ...state, 
            timestamp, 
            q: newQ, 
            running: newQ.length > 0
        }; 
    }),
    'REGISTER TWEENABLE': ((state: ReducerState, [type, payload]: [any, any]) => {
        let [uid, aType, aValue] = payload; 
        let tweenable: Tweenable = new Tweenable(aType, aValue); 
        let newQ = _.clone(state.q); 
        newQ[uid] = tweenable; 
        return { ...state, q: newQ }; 
    }),

    'PARAMATERIZE TWEENABLE': ((state: ReducerState, [type, payload]: [any, any]) => {
        let [uid, toValue, duration] = payload; 
        let newQ = _.clone(state.q); 
        newQ[uid].paramaterize(toValue, duration); 
        return { ...state, q: newQ }; 
    }),
}; 

export function reducer(state: any, action: any[]) {

    let type = action[0]; 
    if (mutators[type] === undefined) {
        throw Error("UNDEFINED MUTATOR KEY: " + type); 
    }

    return mutators[type](state, action); 

}