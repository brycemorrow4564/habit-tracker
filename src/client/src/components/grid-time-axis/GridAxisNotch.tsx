import * as React from "react"; 
import _ from "lodash"; 
import { styled } from "../../theme"; 
import Box, { BoxProps } from "../Box";  
import GridRowLayout from "../GridRowLayout";

export interface GridAxisNotch {
    leftBoxProps: BoxProps, 
    centerBoxProps: BoxProps
}; 

const BoxWrapper: React.FC<{ className?: string, boxProps: BoxProps }> = (props) => {
    return (
        <Box colClassName={props.className} { ...props.boxProps }>
            {props.children}
        </Box>
    ) 
};

const Notch = styled(BoxWrapper)`
    height: ${10}px; 
    background: ${props => props.theme.table_axes_background};
`; 

const NotchLeft = styled(Notch)`
    border-left: ${props => props.theme.table_axes_border}; 
`; 

const NotchRight = styled(Notch)`
    border-right: ${props => props.theme.table_axes_border}; 
    border-bottom: ${props => props.theme.table_axes_border}; 
`

const GridAxisNotch: React.FC<GridAxisNotch> = (props) => {
    return (
        <GridRowLayout 
        left={<NotchLeft boxProps={props.leftBoxProps}/>} 
        center={<NotchRight boxProps={props.centerBoxProps}/>} 
        right={null}/>
    ); 
};

export default GridAxisNotch;
