import * as React from 'react';
import * as ReactDOM from "react-dom"; 
import { LeftOutlined, RightOutlined } from "@ant-design/icons";  
import _ from "lodash"; 
import { Row, Col } from "antd"; 
import { useRootContext } from "../context"; 
import SingleWeekHabitRow from '../components/SingleWeekHabitRow';

function weekIndexMapper(dayIndex: number) {
  return ['MON','TUE','WED','THU','FRI','SAT','SUN'][dayIndex]; 
}

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { cellWidth, windowSize, singleWeekViewOffset, habitHistories } = state; 
    
    const monRef = React.useRef(null); 
    const tueRef = React.useRef(null); 
    const wedRef = React.useRef(null); 
    const thuRef = React.useRef(null); 
    const friRef = React.useRef(null); 
    const satRef = React.useRef(null); 
    const sunRef = React.useRef(null); 
    const refs = [monRef, tueRef, wedRef, thuRef, friRef, satRef, sunRef]; 

    const shiftWindow = (nDays: number) => {
      
    }; 

    const getSubtitle = () => {
      /*
      subtitle changes depending on the selected week 
      */ 
      return 'Current Week'; 
    }

    React.useEffect(() => {

      const onResize = () => {
        let offset = window.innerWidth * (singleWeekViewOffset / 24); 
        let xValues = refs.map((ref) => {
          // @ts-ignore
          let { x, width } = ref.current.getBoundingClientRect(); 
          return x + width/2; 
        }).map(v => v - offset);
        dispatch(['set singleWeekXAnchors', xValues]); 
      }; 
      
      window.addEventListener("resize", onResize);

      onResize(); 

    }, []);

  return (
      <React.Fragment>

        {/* Header */}
        <Row justify="center" align="middle">
          <Col span={8}>
            <h1 className="header-text">Habit Tracker</h1>
          </Col> 
        </Row>

        {/* Sub-Header */}
        <Row justify="center" align="middle">
          <Col span={8}>
            <h4 className="header-text-sub">{getSubtitle()}</h4>
          </Col> 
        </Row>
        
        {/* Time Axis */}
        <Row>
            <Col span={singleWeekViewOffset}>
              <Row justify="end" align="middle">
                <Col>
                  <LeftOutlined translate={0} style={{ color: 'rgb(177, 178, 182)' }} onClick={() => shiftWindow(-7)}/>
                </Col>
              </Row>
            </Col>
            <Col span={24 - 2 * singleWeekViewOffset}>
              <Row justify="space-around" align="middle">
                {_.range(0, windowSize).map((i) => {
                  return (
                    <Col style={{ width: cellWidth }}>
                      <p style={{ textAlign: 'center', color: '#b1b2b6' }} className="weekday" ref={refs[i]}>{weekIndexMapper(i)}</p>
                    </Col>
                  )
                })}
              </Row>
            </Col> 
            <Col span={singleWeekViewOffset}>
              <Row justify="start" align="middle">
                <Col>
                <RightOutlined translate={0} style={{ color: 'rgb(177, 178, 182)' }} onClick={() => shiftWindow(7)}/>
                </Col>
              </Row>
            </Col>
        </Row>

        {/* Divider beneath time axis */}
        <Row>
          <Col offset={singleWeekViewOffset} span={24 - 2 * singleWeekViewOffset}>
            <div style={{ width: '100%', height: 1, border: '.5px solid #b1b2b6' }} />
          </Col> 
        </Row>

        {/* Data Rows */}
        {habitHistories.map((data: number[], i: number) => (<SingleWeekHabitRow data={data} index={i} />))}
        
      </React.Fragment>
  );
}

export default SingleWeekView;
