import * as React from "react"; 
import { LeftOutlined, RightOutlined } from "@ant-design/icons";  
import useDimensions from "react-use-dimensions"; 
import _ from "lodash"; 
import moment from "moment"; 
import { Row, Col, Carousel } from "antd"; 
import { cssLinearGradientPropertyGenerator, weekIndexMapper } from "../utils/util"; 
import { useRootContext } from "../contexts/context"; 
import GridRowLayout from "./GridRowLayout";

/*
The time axis for the habit table viewer 
*/

export interface GridTimeAxisProps {

}

const GridTimeAxis: React.FC<GridTimeAxisProps> = (props) => {

    const { state, dispatch } = useRootContext(); 
    const { 
      cellWidth, 
      windowSize, 
      singleWeekViewOffset, 
      windowStartDate, 
      windowEndDate, 
      windowCount
    } = state; 

    const currentDayColor = "#ffd500"; 
    const currDayIndex = moment().day();  
    const carouselMinSlide = 0; 
    const carouselMaxSlide = windowCount-1; 

    const [carouselElemRef, { width }] = useDimensions();
    const carouselRef = React.useRef(null); 
    const [carouselInit, setCarouselInit] = React.useState<Boolean>(false); 
    const [carouselCurSlide, setCarouselCurSlide] = React.useState<number>(0); 

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

      if (width) {
        let dx = width / 8; 
        let xValues = _.range(0, 7).map(i => (i+1)*dx); 
        console.log(xValues)
        dispatch(['set singleWeekXAnchors', xValues]); 
      }
        
    }, [width]);

    // Ensures the carousel is on the last slide to start 
    React.useEffect(() => {
      if (carouselRef && carouselRef.current && !carouselInit) {
        const lastSlideIndex = windowCount-1; 
        // @ts-ignore
        carouselRef.current.goTo(lastSlideIndex, true); 
        setCarouselCurSlide(lastSlideIndex);
        setCarouselInit(true); 
      }

    }, [carouselRef]); 

// _.range(0, windowCount).map(j => {
                //   return (
                //     <div>
                //       <Row justify="space-around" align="middle">
                //         {_.range(0, windowSize).map((i) => {
                //           const isCurrentDay = (j === windowCount - 1) && (i === currDayIndex); 
                //           return (
                //             <Col style={{ width: cellWidth }}>

                //               <p className={isCurrentDay ? "weekday weekday-current" : "weekday"}>{weekIndexMapper(i)}</p>
                              
                //               {/* <p className="grid-time-axis-month-text"></p>
                //               <p className="grid-time-axis-day-text"></p>
                //               <p className="grid-time-axis-day-of-week-text"></p> */}
                              
                //               {!isCurrentDay ? null : 
                //                               <div className='current-day-indicator' style={{ borderColor: currentDayColor, background: cssLinearGradientPropertyGenerator('transparent', currentDayColor, .05, .025, 65) }} />
                //               }
                //             </Col>
                //           )
                //         })}
                //       </Row>
                //     </div>
                //   );
                // })

  

  return (
      <React.Fragment>

        <GridRowLayout
        left={
          <Row justify="end" align="middle" style={{ height: '100%' }}>
            <Col>
                <Row justify="end" align="middle">
                  <Col>
                      <LeftOutlined translate={0} style={{ color: 'rgb(177, 178, 182)', fontSize: 24 }} onClick={() => shiftWindowByWeek(false)}/>
                  </Col>
                </Row>
            </Col>
          </Row>
        }
        center={
          <React.Fragment>

            {/* The top time axis contained within a carousel */}
            <Carousel ref={carouselRef} dots={false} style={{ position: 'relative' }} afterChange={(value) => setCarouselCurSlide(value)}>

                {
                // _.range(0, windowCount).map(j => {
                //   return (
                //     <div>
                //       <Row justify="space-around" align="middle">
                //         {_.range(0, windowSize).map((i) => {
                //           const isCurrentDay = (j === windowCount - 1) && (i === currDayIndex); 
                //           return (
                //             <Col style={{ width: cellWidth }}>

                //               <p className={isCurrentDay ? "weekday weekday-current" : "weekday"}>{weekIndexMapper(i)}</p>
                              
                //               {/* <p className="grid-time-axis-month-text"></p>
                //               <p className="grid-time-axis-day-text"></p>
                //               <p className="grid-time-axis-day-of-week-text"></p> */}
                              
                //               {!isCurrentDay ? null : 
                //                               <div className='current-day-indicator' style={{ borderColor: currentDayColor, background: cssLinearGradientPropertyGenerator('transparent', currentDayColor, .05, .025, 65) }} />
                //               }
                //             </Col>
                //           )
                //         })}
                //       </Row>
                //     </div>
                //   );
                // })
                }
            </Carousel>

            <div ref={carouselElemRef} style={{ position: 'absolute', width: '100%', height: '100%' }}/>

          </React.Fragment>
        }
        right={
          <Row justify="start" align="middle" style={{ height: '100%' }}>
            <Col>
                <Row justify="start" align="middle">
                  <Col >
                      <RightOutlined translate={0} style={{ color: 'rgb(177, 178, 182)', fontSize: 24  }} onClick={() => shiftWindowByWeek(true)}/>
                  </Col>
                </Row>
            </Col>
          </Row>
        }/>

        {/* Divider beneath time axis */}
        <Row>
          <Col offset={singleWeekViewOffset} span={24 - 2 * singleWeekViewOffset}>
            <div style={{ width: '100%', height: 1, border: '.5px solid #b1b2b6' }} />
          </Col> 
        </Row>

      </React.Fragment>
  );
}

export default GridTimeAxis;
