import moment from "moment"; 
import _ from "lodash"; 
import * as d3color from "d3-color"; 

export function cssLinearGradientPropertyGenerator( colorA: string, 
                                                  colorB: string, 
                                                  stripeRatioA: number, 
                                                  stripeRatioB: number, 
                                                  degrees: number) {
  /*
  Generates a css linear-gradient striping pattern
  */

  let stepStripeA: number = stripeRatioA * 100; 
  let stepStripeB: number = stripeRatioB * 100; 
  let prefix: string = `linear-gradient(${degrees}deg,`;  
  let transforms: string[] = []; 

  let p: number = 0; 
  let p1: number = 0; 
  let toggle: Boolean = true; 
  while (p < 100) {
    let step = toggle ? stepStripeA : stepStripeB; 
    let color = toggle ? colorA : colorB; 
    p1 = Math.min(100, p + step); 
    transforms.push(`${color} ${p}%, ${color} ${p1}%,`); 
    p = p1; 
    toggle = !toggle; 
  }

  let n: number = transforms.length; 
  if (n) {
    // remove comma from last transform in sequence 
    let lastString: string = transforms[n-1]; 
    transforms[n-1] = lastString.substring(0, lastString.length-1); 
  }
  
  let resp = `${prefix}${transforms.join('')})`; 
  return resp; 

}; 

export function weekIndexMapper(dayIndex: number) {
  return ['SUN','MON','TUE','WED','THU','FRI','SAT'][dayIndex]; 
}; 

export function getTimeRange(dStart: moment.Moment, dEnd: moment.Moment, granularity: 'days' | 'weeks') {
  /*
  gets all time points between a start and an end point (inclusive) for 
  a specified temporal granularity. For example: 
    getTimeRange(moment("1/1/2020"), moment("1/3/2020"), "days") === 
    [moment("1/1/2020"), moment("1/2/2020"), moment("1/3/2020")]
  */
  let nDays = dEnd.diff(dStart, granularity) + 1; 
  let range = new Array(nDays);  
  for (let i = 0; i < nDays; i++) {
    range[i] = dStart.clone().add(i+1, 'day'); 
  }
  return range; 
}; 

export function shiftDateRange(dateRange: [moment.Moment, moment.Moment], amount: number, units: 'days' | 'weeks') {
  return dateRange.map(d => d.clone().add(amount, units)); 
}

export function nextSunday(date: moment.Moment) {
  // Returns a reference to the sunday that most closely follows 
  // (inclusive) the current date 
  date = date.clone(); 
  let day = date.day(); 
  if (day !== 0) {
      date.add(7-day);
  }
  return date; 
}; 

export function clamp(v: number, [vmin, vmax]: [number, number]) {
  // clamps a value to a specified range 
  return  v >= vmin && v <= vmax ?    v : 
          v < vmin ?                  vmin :   
                                      vmax; 
}

export function withoutKeys(obj: { [key: string]: any }, skipKeys: Array<string>, protectiveCopy?: boolean, deep?: boolean) {
  let copyFn = deep ? _.cloneDeep : _.clone; 
  let objRef = protectiveCopy ? copyFn(obj) : obj; 
  const rval: any = {}; 
  const keys: Array<string> = Object.keys(objRef); 
  const skipKeysSet: Set<string> = new Set(skipKeys); 
  for (let k of keys) {
      if (!skipKeysSet.has(k)) {
          rval[k] = objRef[k]; 
      }
  } 
  return rval; 
}

export function getTextColor(color: string): string {
  let rgbColor: d3color.RGBColor = d3color.rgb(color);
  let { r, g, b }: { r: number, g: number, b: number } = rgbColor; 
  return (r+g+b)/3 > 127.5 ? 'white' : 'black'; 
}
