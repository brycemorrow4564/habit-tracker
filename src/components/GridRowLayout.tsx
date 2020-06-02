

import * as React from "react";
import { Row, Col } from "antd";
import { useRootContext } from "../contexts/context"; 

type AntdRowJustify = "center" | "start" | "end" | "space-around" | "space-between" | undefined; 
type AntdRowAlign = "top" | "middle" | "bottom" | "stretch" | undefined; 

export interface GridRowLayoutProps { 
    justify?: AntdRowJustify , 
    align?: AntdRowAlign, 
    left: React.ReactNode,      // element to be placed in row left container  
    center: React.ReactNode,    // element to be placed in row center container   
    right: React.ReactNode      // element to be placed in row right container  
};

const defaults: {
    justify: AntdRowJustify, 
    align: AntdRowAlign
} = {
    justify: undefined, 
    align: undefined
}

const GridRowLayout: React.FC<GridRowLayoutProps> = (props) => {

    const { state } = useRootContext(); 
    const { singleWeekViewOffset } = state; 
    const { justify, align, left, center, right } = props; 

    return (
        <Row 
        justify={justify ? justify : defaults.justify} 
        align={align ? align : defaults.align}>
            <Col span={singleWeekViewOffset}>
                {left}
            </Col>
            <Col span={24 - 2 * singleWeekViewOffset}>
                {center}
            </Col> 
            <Col span={singleWeekViewOffset}>
                {right}
            </Col>
        </Row>
    );
};

export default GridRowLayout; 