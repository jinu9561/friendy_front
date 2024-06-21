import { EffectFade } from 'swiper';
import Swiper, { SwiperSlide } from "../../components/swiper";
import heroSliderData from "../../data/hero-sliders/hero-slider-seven.json";
import {useEffect, useState} from "react";
import axios from "axios";
import {useParams} from "react-router-dom";
import EventBannerSingle from "../../components/event/EventBannerSingle";

const params = {
  effect: "fade",
  fadeEffect: {
    crossFade: true
  },
  modules: [EffectFade],
  loop: true,
  speed: 1000,
  navigation: true,
  autoHeight: false
};
// [] 이벤트 리스트

const EventBanner = () => {
  const [events, setEvents] = useState([]);
  const {eventSeq} = useParams();

  useEffect(() => {
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
    console.log(events);

  }, []);

  return (
    <div className="slider-area res-mrg-md-mb">
      <div className="slider-active-3">
        {heroSliderData && (
          <Swiper options={params}>
            {events.map((event, index) => (
              <SwiperSlide key={event.eventSeq}>
                <EventBannerSingle
                  data={event}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </div>
  );
};

export default EventBanner;
