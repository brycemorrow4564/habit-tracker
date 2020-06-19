import * as React from "react"; 
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";  
import { scaleLinear } from "d3-scale";
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, Tabs } from "antd"; 
import { cssLinearGradientPropertyGenerator } from "../utils/util"; 
import { colors } from "../utils/color";
import { useRootContext } from "../contexts/context";
import Box from "./Box";  
import GridRowLayout from "./GridRowLayout";
import "../css/GridTimeAxis.css"; 

/*
The time axis for the habit table viewer 
*/

export interface GridTimeAxisProps {

}

const gi0 = 250;
const gi1 = 120;
const timeAxisColorScale = scaleLinear().range([`rgba(${gi0},${gi0},${gi0}, 1)`, `rgba(${gi1},${gi1},${gi1}, 1)`]); 
// const currentDayBackground = cssLinearGradientPropertyGenerator('transparent', colors.primary.mid, .075, .03, 65); 

const GridTimeAxis: React.FC<GridTimeAxisProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { weeksWindower, today } = state; 
  const axisRef = React.useRef<any>(null); 
  const axisItemRefs = React.useRef<any[]>([]); 

  const window = weeksWindower.window();

  timeAxisColorScale.domain([0, window.length]); 

  // TODO: logic of this effect needs to occur on resize as well
  React.useEffect(() => {
    if (axisItemRefs && axisItemRefs.current && axisRef && axisRef.current) {
      // get the width of the the content-box 
      let globalWidth: number = (axisRef.current as HTMLElement).getBoundingClientRect().width; 
      // get the width of each axis element 
      let widths: Array<number> = axisItemRefs.current.map((el: HTMLElement) => el.getBoundingClientRect().width); 
      // compute space between elements (pixels)
      let timeAxisItemSpacing: number = (globalWidth - widths.reduce((acc,cur) => (acc + cur), 0)) / (widths.length-1);
      dispatch(['update axis item dimensions', [widths, timeAxisItemSpacing]]);
    }
  }, [axisItemRefs, axisRef]); 

  const createAxisItem = (d: moment.Moment, i: number) => {
    let isCurDay: boolean = today.isSame(d, 'days'); 
    let itemColors = {
      'normal': {
        'backgroundColor': timeAxisColorScale(i%7), 
        'border': colors.timeaxis_border, 
        'low': colors.timeaxis_text_normal_low_contrast, 
        'high': colors.timeaxis_text_normal_high_contrast
      }, 
      'current': {
        'backgroundColor': '#46ab16', 
        'border': colors.timeaxis_border, 
        'low': colors.timeaxis_text_current_low_contrast, 
        'high': colors.timeaxis_text_current_high_contrast
      }
    }
    let styleDef = isCurDay ? itemColors.current : itemColors.normal; 
    let lowContrastStyle = { color: styleDef.low };
    let highContrastStyle = { color: styleDef.high };
    let curDayBackgroundColor = styleDef.backgroundColor;
    let curDayBorder = styleDef.border; 
    return (
      <Col key={d.format()} className={'grid-time-label-box'}>
        <div style={{ height: '100%', width: '100%' }} ref={ref => {
          // @ts-ignore
          axisItemRefs.current[i] = ref;
        }}>
          <div style={{ background: curDayBackgroundColor, border: curDayBorder }}>
            {/* Name of month */}
            <Box horizontal="center" vertical="middle">
              <p style={lowContrastStyle} className="grid-time-axis-label grid-time-axis-month">{d.format('MMM')}</p>
            </Box>
            {/* Day of month */}
            <Box horizontal="center" vertical="middle">
              <p style={highContrastStyle} className="grid-time-axis-label grid-time-axis-day">{d.format('D')}</p>
            </Box>
            {/* Label for day of week */}
            <Box horizontal="center" vertical="middle">
              <p style={lowContrastStyle} className="grid-time-axis-label grid-time-axis-day-of-week">{d.format('ddd').toUpperCase()}</p>
            </Box>
          </div>
        </div>
      </Col>
    );
  }; 

  const notchStyle = { height: 7, background: colors.timeaxis_background }; 
  const useBottomBorders: boolean = false; 
  const notchStyleLeft = useBottomBorders ?   Object.assign(_.clone(notchStyle), { borderLeft: colors.timeaxis_border, borderBottom: colors.timeaxis_border }) : 
                                              Object.assign(_.clone(notchStyle), { borderLeft: colors.timeaxis_border }); 
  const notchStyleRight = useBottomBorders ?  Object.assign(_.clone(notchStyle), { borderRight: colors.timeaxis_border, borderBottom: colors.timeaxis_border }) : 
                                              Object.assign(_.clone(notchStyle), { borderRight: colors.timeaxis_border }); 
  const shiftButtonStyle = { color: colors.shift_button_color }; 

  return (
    <div>

      <GridRowLayout
      left={
        <Box horizontal="end" vertical="middle" span={12} rowStyle={{ height: '100%' }} colStyle={{ height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', height: '100%', paddingTop: '1em' }}>
            {/* Left shift button */}
            <Box horizontal="end" vertical="middle" span={6}>
              <Box horizontal="space-around" vertical="middle">
                <LeftCircleFilled 
                style={shiftButtonStyle}
                className="shift-control shift-control-left" 
                translate={0} 
                onClick={() => dispatch(['shift window', false])}/>
              </Box>
            </Box>
            {/* Habit list header */}
            <Box horizontal="start" vertical="bottom" span={24}>
              <Row justify="space-between" align="bottom">
                <Col className="habit-list-header" style={{ borderTop: colors.timeaxis_border, borderRight: colors.timeaxis_border, borderLeft: colors.timeaxis_border, background: colors.timeaxis_background }}>
                  <div>
                    <p className="habit-list-header-label" style={{ color: colors.habitlist_title_color }}>Habits</p>
                  </div>
                </Col>
                <Col flex={1}>
                  <div style={{ width: '100%', borderTop: colors.timeaxis_border, background: colors.timeaxis_background }}></div>
                </Col>
              </Row>
            </Box>
          </div>
        </Box>
      }
      center={
        <div className="axis-row" style={{ background: colors.timeaxis_background, borderTop: colors.timeaxis_border, borderLeft: colors.timeaxis_border, borderRight: colors.timeaxis_border }}>
          <div ref={axisRef}>
            <Row justify="space-around" align="middle">
              {window.map(createAxisItem)}
            </Row>
          </div>
        </div>
      }
      right={
        <Box horizontal="start" vertical="middle" span={12} rowStyle={{ height: '100%' }} colStyle={{ height: '100%' }}>
          <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', height: '100%', paddingTop: '1em' }}>
            {/* Right shift button */} 
            <Box horizontal="start" vertical="middle" span={6}>
              <Box horizontal="space-around" vertical="middle">
                <RightCircleFilled 
                style={shiftButtonStyle}
                className="shift-control shift-control-left" 
                translate={0} 
                onClick={() => dispatch(['shift window', true])}/>
              </Box>
            </Box>
            <Box horizontal="space-around" vertical="bottom" span={6}>
              <p></p> 
            </Box>
          </div>
        </Box>
      }/>

      <GridRowLayout
      left={<Box horizontal="end" vertical="middle" span={12} colStyle={notchStyleLeft}/>}
      center={<Box horizontal="center" vertical="middle" span={24} colStyle={notchStyleRight}/>}
      right={null}/>

    </div>
  );
}

export default GridTimeAxis;
