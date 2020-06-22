import * as React from "react"; 
import CreateHabitModal from "./CreateHabitModal"; 
import UpdateHabitModal from "./UpdateHabitModal"; 

export interface ModalsProps {

}; 

const Modals: React.FC<ModalsProps> = (props) => {

    return (
        <React.Fragment>
            <CreateHabitModal/>
            <UpdateHabitModal/>
        </React.Fragment>
    ); 

}

export default Modals;
