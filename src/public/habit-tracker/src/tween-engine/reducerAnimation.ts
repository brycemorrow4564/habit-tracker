import _ from "lodash";
import { Tweenable, TweenableConnector } from "./tween"; 

export const reducerInitialState = {
    'q': [], 
    'updateIndices': [], 
    'connectors': [], 
    'queueCount': 0, 
    'running': false,
    'timestamp': 0, 
}; 

export interface ReducerState {
    timestamp: number, 
    q: Array<Tweenable>,                   
    updateIndices: Array<number>, 
    connectors: Array<TweenableConnector>, 
    queueCount: number, 
    running: boolean 
};

const mutators: { [key: string] : any } = { 
    'RUN ALL': ((state: ReducerState, [type, payload]: [any, any]) => {
        return { 
            ...state, 
            running: true, 
            queueCount: state.queueCount + 1
        };  
    }),
    'STEP TIME': ((state: ReducerState, [type, payload]: [any, any]) => {
        let [timestamp, timestampIndex] = payload; 
        if (state.q.length) {
        
            let newQ: Array<Tweenable> = _.cloneDeep(state.q);
            let isFirstInvocation = timestampIndex === 0; 
            let updateIndices;
            let running; 
            if (isFirstInvocation) {
                // this is the first invocation of a clocked timing function 
                // determine which of the tweenables is paramaterized. 
                updateIndices = []; 
                for (let i = 0; i < newQ.length; i++) {
                    if (newQ[i].isParamaterized()) {
                        updateIndices.push(i); 
                        if (!newQ[i].getRunning()) {
                            newQ[i].start(timestamp); 
                        }
                    } 
                }
                running = true; 
            } else {
                // update all running tweenables 
                for (let i of state.updateIndices) {
                    newQ[i].update(timestamp); 
                }
                // only keep elements that are still running 
                updateIndices = _.clone(state.updateIndices).filter(i => newQ[i].getRunning());
                // we update the running flag based on whether or not any tweenables are in progress 
                running = updateIndices.length > 0; 
            }
            
            return {
                ...state, 
                timestamp, 
                q: newQ, 
                updateIndices, 
                running
            }; 
        } else {
            return { ...state }; 
        }
    }),
    'REGISTER TWEENABLE': ((state: ReducerState, [type, payload]: [any, any]) => {
        let [uid, aType, aValue] = payload; 
        let tweenableConnector: TweenableConnector = new TweenableConnector(uid, aValue); 
        let tweenable: Tweenable = new Tweenable(aType, aValue, tweenableConnector); 
        let newQ: Array<Tweenable> = _.cloneDeep(state.q); 
        let newConnectors: Array<TweenableConnector> = _.cloneDeep(state.connectors); 
        newQ[uid] = tweenable;
        newConnectors[uid] = tweenableConnector; 
        return { ...state, q: newQ, connectors: newConnectors }; 

    }),
    'PARAMATERIZE TWEENABLE': ((state: ReducerState, [type, payload]: [any, any]) => {
        let [uid, toValue, duration] = payload; 
        let newQ: Array<Tweenable> = _.cloneDeep(state.q); 
        newQ[uid].setToValue(toValue).setDuration(duration); 
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