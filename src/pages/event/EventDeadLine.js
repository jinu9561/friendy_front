import React, { useEffect, useState } from 'react';
import axios from 'axios';
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import { Link } from 'react-router-dom';

const EventDeadLine = () => {
  
    //이벤트 전체 검색 (마감순)
    const [events, setEvents] = useState([
    
    ]);

    useEffect(() => {
      //이벤트 전체 검색 (마감순)
      axios({ 
        method:"GET", 
        url : "http://localhost:9000/event/eventlistdead",
        headers: {
          "Content-Type": "application/json"
        }
        }) 
         .then((res)=>{
            setEvents(res.data); 
        }) 
        .catch((err)=>{ 
          console(err)
          alert(err.response.data.title ); 
        });
    
  }, []);


  const getMainImg = (imgName) => {
        return imgName ? "http://localhost:9000/admin/event/main/img?imgName=" + imgName : defaultProfileImage;
};


    return (
        <div>
        <ul>
          {events.map((event) => (
            <li key={event.eventSeq} className="event-item">
            <div className="event-name" style={{fontSize: "30px"}}>
              {event.eventName} 
            </div>      
            <Link to={`/event/${event.eventSeq}`}>
            <img src={getMainImg(event.eventMainImgName)} alt="" className="event-image" style={{marginTop: "5px"}}/>
            </Link>
            <div className="event-reg-date">{event.eventDeadLine}</div>
            <br></br>
            <br></br>
          </li>
          ))}
        </ul>

        </div>
    );
};

export default EventDeadLine;