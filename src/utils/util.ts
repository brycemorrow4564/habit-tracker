

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
  }