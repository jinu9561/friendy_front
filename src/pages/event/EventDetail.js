import React, { Fragment, useEffect, useState } from "react"; 
import { useSelector } from "react-redux";
import { useParams, useLocation, Route } from "react-router-dom";
import SEO from "../../components/seo";
import LayoutOne from "../../layouts/LayoutOne";
import Breadcrumb from "../../wrappers/breadcrumb/Breadcrumb";
import RelatedProductSlider from "../../wrappers/product/RelatedProductSlider";
import ProductDescriptionTab from "../../wrappers/product/ProductDescriptionTab";
import ProductImageDescription from "../../wrappers/product/ProductImageDescription";
import defaultProfileImage from '../../assets/img/prof/default.jpeg';
import axios from "axios";

const EventDetail = () => {
  const {eventSeq} = useParams();
  let { pathname } = useLocation();
  const [event, setEvent] = useState(null);
  const [eventDetail, setEventDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  

  useEffect(() => {
    if (!eventSeq) return;
    // 이벤트 상세 정보 로드
    axios({
      method: "GET",
      url: `http://localhost:9000/event/detail/${eventSeq}`,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setEvent(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch event details.");
        setLoading(false);
      });
  }, [eventSeq]);

  const getDetailImg = (imgName) => {
    return imgName ? "http://localhost:9000/admin/event/detail/img?imgName=" + imgName : defaultProfileImage;
};

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!event) return <div>Event not found</div>;

  return (
    <Fragment>
      
      <SEO
        titleTemplate="Event Detail"
        description="Product Page of flone react minimalist eCommerce template."
      />

      <LayoutOne headerTop="visible">
        {/* breadcrumb */}
        <Breadcrumb 
          pages={[
            {label: "Home", path: process.env.PUBLIC_URL + "/" },
            {label: "Event Detail", path: process.env.PUBLIC_URL + pathname}
          ]} 
        />

        {/* product description with image */}
        <ProductImageDescription
          spaceTopClass="pt-100"
          spaceBottomClass="pb-100"
          product={{
            id: event.eventSeq,
            image: [event.eventMainImgName],
          }}
        />

        {/* product description tab */}
        <ProductDescriptionTab
          spaceBottomClass="pb-90"
          productFullDesc={event.fullDescription || "No description available"}
        />

<ul>
          {eventDetail.map((event) => (
            <li key={event.eventSeq} className="event-item">
            <div className="event-name" style={{fontSize: "30px"}}>
              {event.eventName} 
            </div>      
            
            <img src={getDetailImg(event.event)} alt="" className="event-image" style={{marginTop: "5px"}}/>
            
            <div className="event-reg-date">{event.eventDeadLine}</div>
            <br></br>
            <br></br>
          </li>
          ))}
        </ul>

        {/* related product slider */}
        <RelatedProductSlider
          spaceBottomClass="pb-95"
          category={event.category || "default"}
        />
      </LayoutOne>
    </Fragment>
  );
};

export default EventDetail;
