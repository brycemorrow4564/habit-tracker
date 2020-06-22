import { easeCubic, easeSinIn, easePolyOut } from 'd3-ease'; 
import _ from "lodash";
import { interpolateTransformSvg } from "d3-interpolate"; 
import { clamp } from "../../utils/util"; 

export enum TweenableType {
    svgTransformString
}; 

export class Tweenable {

    private toValue: any;                   // ending value for the tween 
    private duration: number = 0;           // the total duration of a tween 

    private toValueSet: boolean = false; 
    private durationSet: boolean = false; 

    private interpolator: any;              // dynamically set based on user-defined type (delegate to d3-interpolate)
    private startTimestamp: number = 0;     // timestamp when tween started 
    private elapsed: number = 0;            // the amount of time that has passed since the tween started
    private tweening: boolean = false;      // a boolean that is true only when a tween is occurring 

    private easing: any = easeSinIn;        // easing function used to progress the value of t 

    constructor(private type: TweenableType, private value: any, private facade: TweenableConnector) {
        this.type = type; 
        this.value = value; 
        this.facade = facade; 
    }

    getRunning(): boolean {
        return this.tweening; 
    }

    getValue() {
        return this.value; 
    }

    setToValue(toValue: any): Tweenable {
        this.toValue = toValue;
        this.paramaterizeInterpolator(); 
        this.toValueSet = true; 
        return this; 
    }

    setDuration(duration: number): Tweenable {
        this.duration = duration; 
        this.durationSet = true; 
        return this; 
    }

    setEasing(easing: any): Tweenable {
        this.easing = easing; 
        return this; 
    }

    paramaterizeInterpolator() {
        switch (this.type) {
            case TweenableType.svgTransformString: 
                this.interpolator = interpolateTransformSvg(this.value, this.toValue); 
                break; 
            default: 
                throw new Error('unrecognized tween type');
        }
    }

    isParamaterized() {
        return this.durationSet && this.toValueSet;   
    }

    start(timestamp: number): Tweenable {
        this.startTimestamp = timestamp; 
        this.elapsed = 0;
        this.tweening = true; 
        return this; 
    }

    end() {
        this.toValueSet = false; 
        this.durationSet = false; 
        this.tweening = false; 
    }

    update(timestamp: number): Tweenable {
        this.elapsed = timestamp - (this.startTimestamp as number); 
        if (this.elapsed >= this.duration) {
            this.end();
        }
        let t = clamp(this.easing(this.elapsed / this.duration), [0,1]); 
        this.value = this.interpolator(t);
        this.facade.value(this.value); 
        return this; 
    }

}; 

export class TweenableConnector {

    public static uid: number = -1; 
    static getNextUid() {
        TweenableConnector.uid += 1; 
        return TweenableConnector.uid; 
    }

    private state: any = null; 
    private dispatch: any = null; 
    private _value: any = null; 
    private _toValue: any = null; 
    private _duration: number = 0; 
    private _uid: number = 0; 

    constructor(uid: number, value: any) {
        this._uid = uid; 
        this._value = value; 
    }

    uid(uid: number) {
       this._uid = uid; 
    }

    decorate(state: any, dispatch: any): TweenableConnector {
        this.state = state; 
        this.dispatch = dispatch;
        return this; 
    }

    value(_value: any): TweenableConnector {
        this._value = _value; 
        return this;
    }
    
    toValue(_toValue: any): TweenableConnector {
        this._toValue = _toValue; 
        return this;
    }

    duration(_duration: number): TweenableConnector {
        this._duration = _duration; 
        return this; 
    }

    start(): TweenableConnector {
        this.dispatch(['PARAMATERIZE TWEENABLE', [this._uid, this._toValue, this._duration]]); 
        this.dispatch(['RUN ALL', null]); 
        return this; 
    }
    
}


