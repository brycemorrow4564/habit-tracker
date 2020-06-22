import * as React from "react"; 
import { Row, Col } from "antd"; 

export interface BoxProps {
    vertical?: 'top' | 'middle' | 'bottom', 
    horizontal?: 'start' | 'end' | 'center' | 'space-around' | 'space-between', 
    span?: number, 
    rowStyle?: object, 
    colStyle?: object, 
    colClassName?: string, 
    rowClassName?: string
}; 

const Box: React.FC<BoxProps> = (props) => {

    const { vertical, horizontal, span, rowStyle, colStyle, rowClassName, colClassName } = props; 

    // required props
    let rowProps: any = {}; 
    let colProps: any = {}; 

    // optional row props 
    if (rowStyle)       rowProps['style'] = rowStyle;
    if (horizontal)     rowProps['justify'] = horizontal; 
    if (vertical)       rowProps['align'] = vertical; 
    if (rowClassName)   rowProps['className'] = rowClassName; 

    // optional col props 
    if (colStyle)       colProps['style'] = colStyle;
    if (span)           colProps['span'] = span; 
    if (colClassName)   colProps['className'] = colClassName; 

    // We use destructuring syntax here to allow for the inclusion of our optional props 
    return (
        <Row {...rowProps}>
            <Col {...colProps}>
                {props.children}
            </Col>
        </Row>
    ); 

}

export default Box;
