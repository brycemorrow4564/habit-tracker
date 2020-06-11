import * as React from "react"; 
import { useAnimationContext } from "./animationContext"; 
import { Tweenable, TweenableType } from "./tween"; 

// export function useTweenTrigger() {

//     const { dispatch } = useAnimationContext();

//     let start = (tweenable: Tweenable) => {
        
//     }

//     return { start }; 
// }

export function useTweenValue(aType: TweenableType, aValue: any) {

    const { state, dispatch } = useAnimationContext();
    const { queueCount } = state; 
    const [initQueueCount, setInitQueueCount] = React.useState<number>(queueCount); 

    React.useEffect(() => {
        dispatch(['REGISTER TWEENABLE', [initQueueCount, aType, aValue]]); 
    }, []);

    let paramaterizeTweenable = (toValue: any, duration: number) => {
        dispatch(['PARAMATERIZE TWEENABLE', [initQueueCount, toValue, duration]]); 
    };

    let startTweenable = () => {
        dispatch(['RUN ALL', initQueueCount]); 
    };

    return { paramaterizeTweenable, startTweenable }; 

}; 