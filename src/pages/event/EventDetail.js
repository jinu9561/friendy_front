import React, { Fragment, useEffect, useState } from "react";
import {useParams, useLocation, Route, Link} from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import axios from "axios";
import EventParticipate from "../../components/event/EventParticipate";
import '../../assets/css/EventDetail.css';

const EventDetail = () => {
  let { pathname } = useLocation();
  const {eventSeq} = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    axios({
      method:"GET",
      url : `http://localhost:9000/event/detail/${eventSeq}`,
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
    console.log(events);
  }, [eventSeq]);


  const getDetailImg = (imgName) => {
    return imgName ? `http://localhost:9000/admin/event/detail/img?imgName=${imgName}` : defaultProfileImage;
  };

  return (
      <Fragment>
      <SEO
          titleTemplate="이벤트 페이지"
          description="Shop page of flone react minimalist eCommerce template."
      />
      <LayoutOne headerTop="visible">
      {/* breadcrumb */}
    <Breadcrumb
        pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "EventDetail", path: process.env.PUBLIC_URL + pathname }
        ]}
    />
        <div>
          <ul>
            {events.map((event) => (
                <li key={event.eventSeq} className="event-item">
                    {event.eventDetailImgDTOList?.map((img, index) => (
                        <img
                            key={index}
                            src={getDetailImg(img.eventDetailImgName)}
                            alt={`Event Detail ${index + 1}`}
                            className="event-image-detail"
                        />
                    ))}
                  <br></br>
                  <br></br>
                </li>
            ))}
          </ul>
        </div>
          <EventParticipate/>
      </LayoutOne>
      </Fragment>
  );
};

export default EventDetail;
