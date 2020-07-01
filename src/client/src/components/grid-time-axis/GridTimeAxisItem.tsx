import * as React from "react"; 
import _ from "lodash"; 
import moment from "moment"; 
import { styled } from "../../theme"; 
import Box from "../Box";  

export interface GridTimeAxisItemProps {
    date: moment.Moment, 
    isCurDay: boolean 
}; 
  
const AxisItemCard = styled.div<{ isCurDay: boolean }>`
  border: ${props => props.theme.timeaxis_card_border}; 
  background: ${props => props.isCurDay ?   props.theme.timeaxis_card_current_background : 
                                            props.theme.timeaxis_card_background}; 
`; 

const AxisItemLabel = styled.p<{ isCurDay: boolean }>`
  margin: auto; 
`

const AxisItemMonthLabel = styled(AxisItemLabel)<{ isCurDay: boolean }>`
  margin-top: .4em;
  font-weight: 500;
  color: ${props => props.isCurDay ?  props.theme.timeaxis_text_current_low_contrast : 
                                      props.theme.timeaxis_text_normal_low_contrast}; 
`; 

const AxisItemDayLabel = styled(AxisItemLabel)<{ isCurDay: boolean }>`
  font-weight: 700;
  color: ${props => props.isCurDay ?  props.theme.timeaxis_text_current_high_contrast : 
                                      props.theme.timeaxis_text_normal_high_contrast}; 
`; 

const AxisItemDayOfWeekLabel = styled(AxisItemLabel)<{ isCurDay: boolean }>`
  font-weight: 500;
  letter-spacing: .025em;
  margin-bottom: .4em;
  color: ${props => props.isCurDay ?  props.theme.timeaxis_text_current_low_contrast : 
                                      props.theme.timeaxis_text_normal_low_contrast}; 
`; 

const CenteringBox: React.FC<{}> = (props) => (
  <Box horizontal="center" vertical="middle">
    {props.children}
  </Box>
)

const GridTimeAxisItem: React.FC<GridTimeAxisItemProps> = (props) => {
  const { date, isCurDay } = props; 
  return (
    <AxisItemCard isCurDay={isCurDay}>
      <CenteringBox>
        <AxisItemMonthLabel isCurDay={isCurDay}>{date.format('MMM')}</AxisItemMonthLabel>
      </CenteringBox>
      <CenteringBox>
        <AxisItemDayLabel isCurDay={isCurDay}>{date.format('D')}</AxisItemDayLabel>
      </CenteringBox>
      <CenteringBox>
        <AxisItemDayOfWeekLabel isCurDay={isCurDay}>{date.format('ddd').toUpperCase()}</AxisItemDayOfWeekLabel>
      </CenteringBox>
    </AxisItemCard>
  );
};

export default GridTimeAxisItem; 