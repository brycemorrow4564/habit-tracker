import * as React from 'react';
import * as ReactDOM from "react-dom"; 
import { LeftOutlined, RightOutlined } from "@ant-design/icons";  
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, Carousel } from "antd"; 
import { cssLinearGradientPropertyGenerator, weekIndexMapper } from "../utils/util"; 
import { useRootContext } from "../contexts/context"; 
import { useAnimationDispatcher } from "../hooks/animationManagerHooks"; 
import SingleWeekHabitRow from '../components/SingleWeekHabitRow';

export interface SingleWeekViewProps {

}

const SingleWeekView: React.FC<SingleWeekViewProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { cellWidth, windowSize, singleWeekViewOffset, habitTable, windowStartIndex, windowStartDate, windowEndDate, windowEndIndex, dateMin, dateMax } = state; 
    const { triggerAnimation } = useAnimationDispatcher(); 

    const currentDayColor = "#ffd500"; 
    const numDataWeeks = dateMax.diff(dateMin, 'weeks');
    const currDayIndex = moment().day();  

    const carouselRef = React.useRef(null);
    const [carouselInit, setCarouselInit] = React.useState<Boolean>(false); 
    const [carouselMinSlide, setCarouselMinSlide] = React.useState<number>(0); 
    const [carouselMaxSlide, setCarouselMaxSlide] = React.useState<number>(numDataWeeks-1); 
    const [carouselCurSlide, setCarouselCurSlide] = React.useState<number>(0); 

    const monRef = React.useRef(null); 
    const tueRef = React.useRef(null); 
    const wedRef = React.useRef(null); 
    const thuRef = React.useRef(null); 
    const friRef = React.useRef(null); 
    const satRef = React.useRef(null); 
    const sunRef = React.useRef(null); 
    const refs = [monRef, tueRef, wedRef, thuRef, friRef, satRef, sunRef]; 

    const shiftWindowByWeek = (forwards: boolean) => {
      // shift forwards or backwards by one week 
      if (forwards) {
        dispatch(['shift week forwards', null]);
        if (carouselCurSlide < carouselMaxSlide && carouselRef && carouselRef.current) {
          let curr: any = carouselRef.current; 
          curr.next(); 
        }
      } else {
        dispatch(['shift week backwards', null]);
        if (carouselCurSlide > carouselMinSlide && carouselRef && carouselRef.current) {
          let curr: any = carouselRef.current; 
          curr.prev(); 
        }
      }      
    }; 

    const getSubtitle = () => {
      /*
      subtitle changes depending on the selected week 
      */ 
      return 'Current Week'; 
    }

    const getCurrentDateText = () => {
      /*  the current date window either exists within one 
          month or spans 2 months. format based on this distinction
      */
      let monthStart = windowStartDate.month(); 
      let monthEnd = windowEndDate.month(); 
      if (monthStart === monthEnd) {
        // Display month once at start of string 
        return `${windowStartDate.format('MMM D')} - ${windowEndDate.format('D')}`; 
      } else {
        // Display month on both sides of the '-' 
        return `${windowStartDate.format('MMM D')} - ${windowEndDate.format('MMM D')}`; 
      }
    }; 

    React.useEffect(() => {

      const onResize = () => {
        let offset = window.innerWidth * (singleWeekViewOffset / 24); 
        let xValues = refs.map((ref) => {
          // @ts-ignore
          let { x, width } = ref.current.getBoundingClientRect(); 
          return x + width/2; 
        }).map(v => v - offset);
        // console.log(xValues.map(v => v * (numDataWeeks - 1))); 
        dispatch(['set singleWeekXAnchors', xValues]); 
      }; 
      
      window.addEventListener("resize", onResize);

      onResize(); 

    }, []);

    // Ensures the carousel is on the last slide to start 
    React.useEffect(() => {
      if (carouselRef && carouselRef.current && !carouselInit) {
        const lastSlideIndex = numDataWeeks-1; 
        // @ts-ignore
        carouselRef.current.goTo(lastSlideIndex, true); 
        setCarouselCurSlide(lastSlideIndex);
        setCarouselInit(true); 
      }

    }, [carouselRef]); 

    // FOR TESTING 
    React.useEffect(() => {
      if (carouselInit) {
        triggerAnimation('single-week-view-init'); 
      }
    }, [carouselInit]); 

  return (
      <React.Fragment>

        {/* Header */}
        <Row justify="center" align="middle">
          <Col span={8}>
            <h1 className="header-text">Habit Tracker</h1>
          </Col> 
        </Row>

        {/* Text describing time granularity of current view */}
        {/* <Row justify="center" align="middle">
          <Col span={8}>
            <h4 className="header-text-sub" style={{ fontSize: 22 }}>{getSubtitle()}</h4>
          </Col> 
        </Row> */}

        {/* Text describing current time window of analysis */}
        <Row justify="center" align="middle">
          <Col span={8}>
            <h4 className="header-text-sub" style={{ fontSize: 22 }}>{getCurrentDateText()}</h4>
          </Col> 
        </Row>
        
        {/* Time Axis */}
        <Row>
            
            {/* Shift left icon */}
            <Col span={singleWeekViewOffset}>
              <Row justify="end" align="middle" style={{ height: '100%' }}>
                <Col>
                    <Row justify="end" align="middle">
                      <Col >
                          <LeftOutlined translate={0} style={{ color: 'rgb(177, 178, 182)', fontSize: 24 }} onClick={() => shiftWindowByWeek(false)}/>
                      </Col>
                    </Row>
                </Col>
              </Row>
            </Col>
            
            {/* Carousel of week axes */}
            <Col span={24 - 2 * singleWeekViewOffset}>

              {/* The top time axis contained within a carousel */}
              <Carousel ref={carouselRef} dots={false} style={{ position: 'relative' }} afterChange={(value) => setCarouselCurSlide(value)}>
                  {_.range(0, numDataWeeks).map(j => {
                    return (
                      <div>
                        <Row justify="space-around" align="middle">
                          {_.range(0, windowSize).map((i) => {
                            const isCurrentDay = (j === numDataWeeks - 1) && (i === currDayIndex); 
                            return (
                              <Col style={{ width: cellWidth }}>
                                <p className={isCurrentDay ? "weekday weekday-current" : "weekday"}>{weekIndexMapper(i)}</p>
                                {!isCurrentDay ? null : 
                                                <div className='current-day-indicator' style={{ borderColor: currentDayColor, background: cssLinearGradientPropertyGenerator('transparent', currentDayColor, .05, .025, 65) }} />
                                }
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
                        {/* <div style={{ height: '1em', width: '100%' , border: `1px solid ${currentDayColor}`, background: cssLinearGradientPropertyGenerator('transparent', currentDayColor, .05, .025, 65) }} /> */}
                      </Col>
                    )
                  })}
                </Row>
              </div>

            </Col> 

            {/* Shift right icon */}
            <Col span={singleWeekViewOffset}>
              <Row justify="start" align="middle" style={{ height: '100%' }}>
                <Col>
                    <Row justify="start" align="middle">
                      <Col >
                          <RightOutlined translate={0} style={{ color: 'rgb(177, 178, 182)', fontSize: 24  }} onClick={() => shiftWindowByWeek(true)}/>
                      </Col>
                    </Row>
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
        {habitTable.map((data: number[], i: number) => (<SingleWeekHabitRow data={data.slice(windowStartIndex, windowEndIndex+1)} index={i} />))}
        
        {/*  */}

      </React.Fragment>
  );
}

export default SingleWeekView;