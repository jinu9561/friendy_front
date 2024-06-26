import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import { Link } from 'react-router-dom';
import HeroSliderSevenSingle from "../../components/hero-slider/HeroSliderSevenSingle";
import '../../assets/css/AdminEventList.css';

const AdminEventList = ({onEventSelect}) => {
  
    //이벤트 전체 검색 (등록순)
    const [events, setEvents] = useState([
    
    ]);

    useEffect(() => {
      //이벤트 전체 검색 (등록순)
      axios({ 
        method:"GET", 
        url : "http://localhost:9000/event/eventlist",
        headers: {
          "Content-Type": "application/json"
        }
        }) 
         .then((res)=>{
            console.log(res)
            setEvents(res.data); 
            console.log(events)
        }) 
        .catch((err)=>{ 
          console(err)
          alert(err.response.data.title ); 
        });


  }, []);



  const getMainImg = (imgName) => {
        return imgName ? "http://localhost:9000/admin/event/main/img?imgName=" + imgName : defaultProfileImage;
};

    const handleCheckboxChange = (eventSeq) => {
        onEventSelect(eventSeq);
    };

    return (
        <div className="event-list">
        <ul>
          {events.map((event) => (
              <li key={event.eventSeq} className="eventlist-item">
                  <input
                      type="checkbox"
                      onChange={() => handleCheckboxChange(event.eventSeq)}
                      style={{
                          transform: 'scale(0.5 ) translateY(-30px)',  // 체크박스 크기를 80%로 줄임
                          marginLeft: '-40%'       // 체크박스를 왼쪽으로 10px 이동

                      }}

                  />
                  <div className="event-name" style={{fontSize: "200%"}}>
                      {event.eventName}
                  </div>
                  {<Link to={`/event/${event.eventSeq}`}>
                      <img src={getMainImg(event.eventMainImgName)} alt="" className="event-image"
                           style={{marginTop: "1%"}}/>
                  </Link>}

                  {/* <img src={getMainImg(event.eventMainImgName)} alt="" className="event-image" style={{marginTop: "5px"}}/> */}

                  <div className="event-reg-date" style={{marginTop: "1%"}}>{event.eventRegDate}</div>
                  <br></br>
                  <br></br>
              </li>
          ))}
        </ul>

        </div>
    );
};

export default AdminEventList;