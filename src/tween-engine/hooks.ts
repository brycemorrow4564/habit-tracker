import * as React from "react"; 
import _ from "lodash"; 
import { useAnimationContext } from "./animationContext"; 
import { Tweenable, TweenableType, TweenableConnector } from "./tween"; 

export function useTweenValue(aType: TweenableType, aValue: any) {

    const { state, dispatch } = useAnimationContext();
    const { q, connectors } = state; 
    const [localUid, setLocalUid] = React.useState<number>(-1);
    const registered = localUid >= 0;  
    let tweenable: Tweenable | null = null; 
    let connector: TweenableConnector | null = null; 
    if (registered) {
        tweenable = q[localUid]; 
        connector = connectors[localUid].decorate(state, dispatch); 
    }

    React.useEffect(() => {
        let uid = TweenableConnector.getNextUid(); 
        setLocalUid(uid);
        dispatch(['REGISTER TWEENABLE', [uid, aType, aValue]]); 
    }, []);

    return [registered, connector, tweenable ? (tweenable as Tweenable).getValue() : null]; 

}; 