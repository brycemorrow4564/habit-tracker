import * as React from "react"; 
import { LeftCircleFilled, RightCircleFilled } from "@ant-design/icons";  
import { scaleLinear } from "d3-scale";
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, Tabs } from "antd"; 
import { cssLinearGradientPropertyGenerator } from "../utils/util"; 
import { colors } from "../utils/color";
import { useRootContext } from "../contexts/context";
import Box, { BoxProps } from "./Box";  
import GridRowLayout from "./GridRowLayout";
import { ReducerState } from "../reducers/reducer"; 
import "../css/GridTimeAxis.css"; 

/*
The time axis for the habit table viewer 
*/

export interface GridTimeAxisProps {

}

const gi0 = 250;
const gi1 = 120;
const timeAxisColorScale = scaleLinear().range([`rgba(${gi0},${gi0},${gi0}, 1)`, `rgba(${gi1},${gi1},${gi1}, 1)`]); 

const GridTimeAxis: React.FC<GridTimeAxisProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { weeksWindower, today }: ReducerState = state; 
  const axisRef = React.useRef<any>(null); 
  const axisItemRefs = React.useRef<any[]>([]); 

  const window: Array<moment.Moment> = weeksWindower.window();
  const wlen: number = window.length; 
  const windowLeft = window.slice(0, wlen/2); 
  const windowRight = window.slice(wlen/2, wlen); 

  timeAxisColorScale.domain([0, window.length]); 

  // TODO: logic of this effect needs to occur on resize as well
  React.useEffect(() => {
    if (axisItemRefs && axisItemRefs.current && axisRef && axisRef.current) {
      // Compute the x positions of the axis items relative to the parent container 
      // the layout is generated by flexbox so we need to use the computed style to derive this
      let containerDims = (axisRef.current as HTMLElement).getBoundingClientRect(); 
      let xs = axisItemRefs.current.map((el: HTMLElement) => {
        let { left, width }: DOMRect = el.getBoundingClientRect(); 
        return (left + width) - containerDims.left; 
      }); 
      dispatch(['update axis item dimensions', xs]);
    }
  }, [axisItemRefs, axisRef]); 

  const createAxisItem = (iOffset: number, d: moment.Moment, i: number) => {
    i += iOffset; 
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

  const notchStyle = { height: 8, background: colors.timeaxis_background }; 
  const useBottomBorders: boolean = false; 
  const notchStyleLeft = useBottomBorders ?   Object.assign(_.clone(notchStyle), { borderLeft: colors.timeaxis_border, borderBottom: colors.timeaxis_border }) : 
                                              Object.assign(_.clone(notchStyle), { borderLeft: colors.timeaxis_border }); 
  const notchStyleRight = useBottomBorders ?  Object.assign(_.clone(notchStyle), { borderRight: colors.timeaxis_border, borderBottom: colors.timeaxis_border }) : 
                                              Object.assign(_.clone(notchStyle), { borderRight: colors.timeaxis_border }); 
  const shiftButtonStyle = { color: colors.shift_button_color }; 

  const leftBoxProps: BoxProps = { horizontal: 'end', vertical: 'middle', span: colors.left_span }; 
  const centerBoxProps: BoxProps = { horizontal: 'center', vertical: 'middle', span: 24 }; 
  const rightBoxProps: BoxProps = { horizontal: 'start', vertical: 'middle', span: colors.right_span }; 

  return (
    <div>

      <GridRowLayout
      left={
        <Box { ...leftBoxProps } rowStyle={{ height: '100%' }} colStyle={{ height: '100%' }}>
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
                <Col className="habit-list-header" style={{ borderTop: colors.timeaxis_border, borderRight: colors.timeaxis_border, borderLeft: colors.timeaxis_border, borderBottom: colors.habitlist_header_border_bottom, background: colors.timeaxis_background }}>
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
        <Box { ...centerBoxProps } span={24}>
          <div className="axis-row" style={{ background: colors.timeaxis_background, borderTop: colors.timeaxis_border, borderLeft: colors.timeaxis_border, borderRight: colors.timeaxis_border }}>
            <div ref={axisRef}>
              <Row justify="space-between" align="middle">
                <Col span={11}>
                  <Row justify="space-around" align="middle">
                    {windowLeft.map(_.partial(createAxisItem, 0))}
                  </Row>
                </Col>
                <Col span={11}>
                  <Row justify="space-around" align="middle">
                    {windowRight.map(_.partial(createAxisItem, 7))}
                  </Row>
                </Col>
              </Row>
            </div>
          </div>
        </Box>
      }
      right={
        <Box { ...rightBoxProps } rowStyle={{ height: '100%' }} colStyle={{ height: '100%' }}>
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
      left={<Box { ...leftBoxProps } colStyle={notchStyleLeft}/>}
      center={<Box { ...centerBoxProps } colStyle={notchStyleRight}/>}
      right={null}/>

    </div>
  );
}

export default GridTimeAxis;
