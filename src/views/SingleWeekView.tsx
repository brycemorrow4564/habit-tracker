import * as React from 'react';
import * as ReactDOM from "react-dom"; 
import { LeftOutlined, RightOutlined } from "@ant-design/icons";  
import _ from "lodash"; 
import { Row, Col, Carousel } from "antd"; 
import { useRootContext } from "../context"; 
import SingleWeekHabitRow from '../components/SingleWeekHabitRow';

function weekIndexMapper(dayIndex: number) {
  return ['MON','TUE','WED','THU','FRI','SAT','SUN'][dayIndex]; 
}

export interface SingleWeekViewProps {

}

function cssLinearGradientPropertyGenerator(colorA: string, colorB: string, stripeRatioA: number, stripeRatioB: number, degrees: number) {
  /*
  Generates a css linear-gradient striping pattern
  */

  let stepStripeA: number = stripeRatioA * 100; 
  let stepStripeB: number = stripeRatioB * 100; 
  let prefix: string = `linear-gradient(${degrees}deg,`;  
  let transforms: string[] = []; 

  let p: number = 0; 
  let p1: number = 0; 
  let toggle: Boolean = true; 
  while (p < 100) {
    let step = toggle ? stepStripeA : stepStripeB; 
    let color = toggle ? colorA : colorB; 
    p1 = Math.min(100, p + step); 
    transforms.push(`${color} ${p}%, ${color} ${p1}%,`); 
    p = p1; 
    toggle = !toggle; 
  }

  let n: number = transforms.length; 
  if (n) {
    // remove comma from last transform in sequence 
    let lastString: string = transforms[n-1]; 
    transforms[n-1] = lastString.substring(0, lastString.length-1); 
  }
  
  let resp = `${prefix}${transforms.join('')})`; 
  return resp; 

}; 

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { cellWidth, windowSize, singleWeekViewOffset, habitTable, habitTableStartIndex, habitTableEndIndex } = state; 

    const currentDayColor = "#ffd500"; 

    const carouselRef = React.useRef(null);
    
    const monRef = React.useRef(null); 
    const tueRef = React.useRef(null); 
    const wedRef = React.useRef(null); 
    const thuRef = React.useRef(null); 
    const friRef = React.useRef(null); 
    const satRef = React.useRef(null); 
    const sunRef = React.useRef(null); 
    const refs = [monRef, tueRef, wedRef, thuRef, friRef, satRef, sunRef]; 

    const shiftWindowByWeek = (direction: number) => {
      // ensure the current range can be shifted. if so, signal a shift
      if (direction < 0 && habitTableStartIndex >= 7) {
        dispatch(['set habitTableIndexRange', [habitTableStartIndex - 7, habitTableEndIndex - 7]]); 
        if (carouselRef && carouselRef.current) {
          let curr: any = carouselRef.current; 
          curr.prev(); 
        }
        
      }
      else if (direction > 0 && habitTableEndIndex + 7 < habitTable[0].length) {
        dispatch(['set habitTableIndexRange', [habitTableStartIndex + 7, habitTableEndIndex + 7]]); 
        if (carouselRef && carouselRef.current) {
          let curr: any = carouselRef.current; 
          curr.next(); 
        }
      }      
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
        // console.log(xValues.map(v => v * (Math.ceil(habitTable[0].length / 7) - 1))); 
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
                  <LeftOutlined translate={0} style={{ color: 'rgb(177, 178, 182)' }} onClick={() => shiftWindowByWeek(-1)}/>
                </Col>
              </Row>
            </Col>
            <Col span={24 - 2 * singleWeekViewOffset}>

              {/* The top time axis contained within a carousel */}
              <Carousel ref={carouselRef} dots={false} style={{ position: 'relative' }}>
                  {_.range(0, Math.ceil(habitTable[0].length / 7)).map(j => {
                    return (
                      <div>
                        <Row justify="space-around" align="middle">
                          {_.range(0, windowSize).map((i) => {
                            return (
                              <Col style={{ width: cellWidth }}>
                                <p style={{ textAlign: 'center', color: '#b1b2b6' }} className="weekday">{weekIndexMapper(i)}</p>
                                <div style={{ height: '1em', width: '100%' , border: `1px solid ${currentDayColor}`, background: cssLinearGradientPropertyGenerator('transparent', currentDayColor, .05, .025, 65) }} />
                              </Col>
                            )
                          })}
                        </Row>
                      </div>
                    );
                  })}
              </Carousel>

              {/* Ghost element used to compute x anchors  */}
              <div style={{ opacity: 0, position: 'absolute', left: 0, top: 0, width: '100%' }}>
                <Row justify="space-around" align="middle">
                  {_.range(0, windowSize).map((i) => {
                    return (
                      <Col style={{ width: cellWidth }}>
                        <p style={{ textAlign: 'center', color: '#b1b2b6' }} className="weekday" ref={refs[i]}>{weekIndexMapper(i)}</p>
                        <div style={{ height: '1em', width: '100%' , border: `1px solid ${currentDayColor}`, background: cssLinearGradientPropertyGenerator('transparent', currentDayColor, .05, .025, 65) }} />
                      </Col>
                    )
                  })}
                </Row>
              </div>

            </Col> 
            <Col span={singleWeekViewOffset}>
              <Row justify="start" align="middle">
                <Col>
                <RightOutlined translate={0} style={{ color: 'rgb(177, 178, 182)' }} onClick={() => shiftWindowByWeek(1)}/>
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
        {habitTable.map((data: number[], i: number) => (<SingleWeekHabitRow data={data.slice(habitTableStartIndex, habitTableEndIndex+1)} index={i} />))}
        
      </React.Fragment>
  );
}

export default SingleWeekView;
