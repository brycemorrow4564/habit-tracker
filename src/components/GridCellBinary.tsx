import * as React from "react";
import _ from "lodash"; 

export interface GridCellBinaryProps { 
    width: number, 
    height: number, 
    active?: Boolean 
};

const activeColor = '#00FF00'; 
const inactiveColor = '#dedede'; 

const GridCellBinary: React.FC<GridCellBinaryProps> = (props) => {

    const { width, height, active } = props; 
    const [color, setColor] = React.useState<string>(active ? activeColor : inactiveColor);

    let handleClick = () => {
        setColor(color === activeColor ? inactiveColor : activeColor);
    }; 

    return (
        <div className="habit-grid-cell" style={{ width, height }} onClick={handleClick}>
            <div className="habit-grid-cell-fillable" style={{ background: color }} />
        </div>
    );

};

export default GridCellBinary; 