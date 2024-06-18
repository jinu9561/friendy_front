import clsx from "clsx";
import { useSelector } from "react-redux";
import Swiper, { SwiperSlide } from "../../components/swiper";
import SectionTitleThree from "../../components/section-title/SectionTitleThree";
import PlaceRecommend from "../../components/place/PlaceRecommend";
import { useEffect, useState } from "react";
import axios from "axios";
import '../../assets/css/placeRecommend.css';


const settings = {
  loop: false,
  grabCursor: true,
  observer: true,
  observeParents: true,
  spaceBetween: 30,
  breakpoints: {
      320: {
          slidesPerView: 1
      },
      576: {
          slidesPerView: 2
      },
      768: {
          slidesPerView: 3
      },
      1024: {
          slidesPerView: 4
      }
  }
};

const PlaceRecommendSlider = ({
  spaceTopClass,
  spaceBottomClass,
}) => {

  const currency = useSelector((state) => state.currency);

  const [places,setPlaces] = useState([]);


  useEffect(() => {
    let userId = localStorage.getItem('userId');

    axios({ 
      method:"POST", 
      url : "http://localhost:9000/place/",
      data: {
        userId: userId ? userId : "",
      },
      headers: {
        "Content-Type": "application/json"
      }
    })
      .then((res) => {
          console.log(res.data);
          setPlaces(res.data);
          console.log(places);
      }) 
      .catch((err)=>{ 
        console.log(err)
        console.log(err.response.data.title);
  });
  

  },[]);





  return (
    <div className={clsx("new-product-area", spaceBottomClass, spaceTopClass)}>
      <div className="container">
        <SectionTitleThree
          titleText="Friendy Hot Place"
          positionClass="text-center"
          spaceClass="mb-60"
        />
        
          <Swiper options={settings}>
            {places.map((place) => (
                <SwiperSlide key={place.placeSeq}>
                     <PlaceRecommend
                        place={place}
                        currency={currency}
                    />
                </SwiperSlide>
            ))}
          </Swiper>
       
      </div>
    </div>
  );
};


export default PlaceRecommendSlider;
