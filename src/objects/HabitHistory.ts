
import * as React from "react"; 

class HabitHistory extends React.Component {

    constructor(public habitName: string, 
                // public timeDomain: [Date, Date]
                ) {
        /*
        habitName (String): 
            the string id of the habit the history corresponds to  
        */
        super(habitName); 
        
        this.habitName = habitName; 
        // this.timeDomain = timeDomain; 

    }
}

export default HabitHistory; 