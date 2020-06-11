import * as React from "react"; 
import { useAnimationContext } from "./animationContext"; 
import { Tweenable, TweenableType } from "./tween"; 

export class TweenFacade {

    private state: any = null; 
    private dispatch: any = null; 

    constructor(private uid: number) {
        this.uid = uid; 
    }

    decorate(state: any, dispatch: any): TweenFacade{
        this.state = state; 
        this.dispatch = dispatch;
        return this; 
    }

    paramaterize(toValue: any, duration: number): TweenFacade {
        this.dispatch(['PARAMATERIZE TWEENABLE', [this.uid, toValue, duration]]); 
        return this; 
    }

    start(): TweenFacade {
        this.dispatch(['RUN ALL', this.uid]); 
        return this; 
    }

    value() {
        return this.state.q && this.state.q[this.uid] ? this.state.q[this.uid].getValue() : null; 
    }
    
}

export function useTweenValue(aType: TweenableType, aValue: any) {

    const { state, dispatch } = useAnimationContext();
    const { queueCount } = state; 
    const [initQueueCount, setInitQueueCount] = React.useState<number>(queueCount); 
    const [facade, setFacade] = React.useState<TweenFacade>(new TweenFacade(initQueueCount)); 

    React.useEffect(() => {
        dispatch(['REGISTER TWEENABLE', [initQueueCount, aType, aValue]]); 
    }, []);

    return facade.decorate(state, dispatch); 

}; 