import * as React from "react"; 
import { LeftCircleOutlined, RightCircleOutlined } from "@ant-design/icons";  
import { scaleLinear } from "d3-scale";
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col } from "antd"; 
import { cssLinearGradientPropertyGenerator } from "../utils/util"; 
import { colors } from "../utils/color";
import { useRootContext } from "../contexts/context"; 
import GridRowLayout from "./GridRowLayout";

/*
The time axis for the habit table viewer 
*/

export interface GridTimeAxisProps {

}

const gi0 = 250;
const gi1 = 160;
const timeAxisColorScale = scaleLinear().range([`rgba(${gi0},${gi0},${gi0}, 1)`, `rgba(${gi1},${gi1},${gi1}, 1)`]); 
const currentDayBackground = cssLinearGradientPropertyGenerator('transparent', colors.primary.mid, .075, .03, 65); 

const GridTimeAxis: React.FC<GridTimeAxisProps> = (props) => {

  const { state, dispatch } = useRootContext(); 
  const { weeksWindower } = state; 
  const axisRef = React.useRef<any>(null); 
  const axisItemRefs = React.useRef<any[]>([]); 

  const today = moment(); 
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

  return (
      <React.Fragment>

        <GridRowLayout
        left={
          <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col span={12} style={{ background: colors.primary.dark, height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', height: '100%', paddingTop: '1em' }}>
                <Row justify="end" align="middle">
                  <Col span={6}>
                      <Row justify="space-around" align="middle">
                        <Col>
                          <LeftCircleOutlined 
                          style={{ color: colors.primary.light }}
                          className="shift-control shift-control-left" 
                          translate={0} 
                          onClick={() => dispatch(['shift window', false])}/>
                        </Col>
                      </Row>
                  </Col>
                </Row>
                <Row justify="start" align="bottom">
                  <Col span={6}>
                      <p style={{ color: colors.primary.light, marginBottom: 4, marginLeft: 8 }}>Habits</p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        }
        center={
          <div className="axis-row">

            <div ref={axisRef}>

              <Row justify="space-around" align="middle" style={{ background: colors.primary.dark }}>
                {window.map((d: moment.Moment, i: number) => (
                  <Col key={d.format()} className={'grid-time-label-box'}>
                    
                    <div style={{ height: '100%', width: '100%' }} ref={ref => {
                      // @ts-ignore
                      axisItemRefs.current[i] = ref;
                    }}>

                      <div style={{ background: timeAxisColorScale(i%7) }}>

                        {/* Name of month */}
                        <Row justify="center" align="middle">
                          <Col>
                            <p className="grid-time-axis-label grid-time-axis-month">{d.format('MMM')}</p>
                          </Col>
                        </Row>

                        {/* Day of month */}
                        <Row justify="center" align="middle">
                          <Col>
                          <p className="grid-time-axis-label grid-time-axis-day">{d.format('D')}</p>
                          </Col>
                        </Row>

                        {/* Label for day of week */}
                        <Row justify="center" align="middle">
                          <Col>
                          <p className="grid-time-axis-label grid-time-axis-day-of-week">{d.format('ddd').toUpperCase()}</p>
                          </Col>
                        </Row>

                        {/* Indicates which day is the current day */}
                        <Row justify="center" align="middle">
                          <Col span={24}>
                            {<div className='current-day-indicator' style={{ borderColor: colors.primary.mid, background: currentDayBackground, opacity: today.isSame(d, 'days') ? 1 : 0 }} />}
                          </Col>
                        </Row>

                      </div>

                    </div>
                    
                  </Col>
                ))}
              </Row>
          
            </div>

          </div>
        }
        right={
          <Row justify="start" align="middle" style={{ height: '100%' }}>
            <Col span={10} style={{ background: colors.primary.dark, height: '100%' }}>
              <div style={{ display: 'flex', flexDirection: "column", justifyContent: 'space-between', height: '100%', paddingTop: '1em' }}>
                <Row justify="start" align="middle">
                  <Col span={6}>
                      <Row justify="space-around" align="middle">
                        <Col>
                          <RightCircleOutlined 
                          style={{ color: colors.primary.light }}
                          className="shift-control shift-control-left" 
                          translate={0} 
                          onClick={() => dispatch(['shift window', true])}/>
                        </Col>
                      </Row>
                  </Col>
                </Row>
                <Row justify="space-around" align="bottom">
                  <Col span={6}>
                      <p></p>
                  </Col>
                </Row>
              </div>
            </Col>
          </Row>
        }/>

      </React.Fragment>
  );
}

export default GridTimeAxis;
