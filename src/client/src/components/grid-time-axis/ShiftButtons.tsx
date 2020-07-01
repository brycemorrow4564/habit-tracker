import * as React from "react"; 
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";  
import { styled } from "../../theme"; 

export interface ShiftButtonProps {
    className?: string,
    onClick: () => void
  }; 
  
  const ShiftButtonIconLeftUnstyled: React.FC<ShiftButtonProps> = ({ onClick, className }) => {
    return (
      <LeftCircleFilled {...(className ? {className} : {})} translate={0} onClick={onClick}/>
    );
  }
  
  const ShiftButtonIconRightUnstyled: React.FC<ShiftButtonProps> = ({ onClick, className }) => {
    return (
      <RightCircleFilled {...(className ? {className} : {})} translate={0} onClick={onClick}/>
    );
  }
  
  export const ShiftButtonIconLeft = styled(ShiftButtonIconLeftUnstyled)`
    font-size: 1.75em; 
    color: ${props => props.theme.shift_button_color}
  `; 
  
  export const ShiftButtonIconRight = styled(ShiftButtonIconRightUnstyled)`
    font-size: 1.75em; 
    color: ${props => props.theme.shift_button_color}
  `; 

